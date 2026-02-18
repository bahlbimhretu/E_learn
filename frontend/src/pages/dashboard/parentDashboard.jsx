import { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

// 🔹 Reusable Stat Card
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "text-blue-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border">
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold mt-2 ${colors[color]}`}>
        {value ?? "--"}
      </p>
    </div>
  );
};

const ParentDashboard = () => {
  const { user } = useContext(AuthContext);

  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [overview, setOverview] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const { data } = await api.get("/parent/children");
        setChildren(data);

        if (data.length > 0) {
          setSelectedChild(data[0]);
        }
      } catch (err) {
        console.error("Error fetching children", err);
      }
    };

    fetchChildren();
  }, []);

  // 🔹 Fetch overview + performance when child changes
  useEffect(() => {
    if (!selectedChild) return;

    const fetchChildData = async () => {
      try {
        setLoading(true);

        const [overviewRes, performanceRes] = await Promise.all([
          api.get(`/parent/${selectedChild._id}/overview`),
          api.get(`/parent/${selectedChild._id}/performance`),
        ]);

        setOverview(overviewRes.data);
        setPerformance(performanceRes.data);
      } catch (err) {
        console.error("Error fetching child data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [selectedChild]);

  // 🔹 Risk detection
  const riskAlerts = [];

  if (overview?.overallAverage < 60) {
    riskAlerts.push("Overall performance is below passing level.");
  }

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Parent Dashboard</h2>
          <p className="text-gray-500 text-sm">
            Welcome, {user?.name}
          </p>
        </div>

        {/* Child Selector */}
        {children.length > 0 && (
          <div className="mb-6">
            <label className="text-sm text-gray-600 mr-3">
              Select Child:
            </label>
            <select
              value={selectedChild?._id}
              onChange={(e) =>
                setSelectedChild(
                  children.find(
                    (child) => child._id === e.target.value
                  )
                )
              }
              className="border rounded px-3 py-2 text-sm bg-white"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name} (Grade {child.studentProfile?.grade} - {child.studentProfile?.section})
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <StatCard
                title="Overall Average"
                value={`${overview?.overallAverage ?? "--"}%`}
                color="green"
              />
              <StatCard
                title="Enrolled Courses"
                value={overview?.enrolledCourses}
                color="blue"
              />
              <StatCard
                title="Subjects With Results"
                value={overview?.subjectsCount}
                color="purple"
              />
            </div>

            {/* Risk Alerts */}
            {riskAlerts.length > 0 && (
              <div className="mb-8 space-y-3">
                {riskAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm"
                  >
                    ⚠ {alert}
                  </div>
                ))}
              </div>
            )}

            {/* Performance Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold mb-4">
                Subject Performance
              </h3>

              {performance.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No results available yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {performance.map((subject, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{subject.subject}</span>
                        <span
                          className={
                            subject.finalScore < 60
                              ? "text-red-600 font-semibold"
                              : "text-gray-700"
                          }
                        >
                          {subject.finalScore}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded">
                        <div
                          className={`h-2 rounded ${
                            subject.finalScore < 60
                              ? "bg-red-500"
                              : "bg-blue-600"
                          }`}
                          style={{
                            width: `${subject.finalScore}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ParentDashboard;
