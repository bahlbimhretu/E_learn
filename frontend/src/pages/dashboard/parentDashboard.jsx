import { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import { AlertTriangle, BookOpen, CheckCircle, Percent } from "lucide-react";
import { Link } from "react-router-dom";

// 🔹 Reusable Stat Card
const StatCard = ({ title, value, color, icon: Icon }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    orange: "text-orange-600 bg-orange-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center gap-4">
      <div className={`p-3 rounded-lg ${colors[color]}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>
          {value ?? "--"}
        </p>
      </div>
    </div>
  );
};

const ParentDashboard = () => {
  const { user } = useContext(AuthContext);

  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [overview, setOverview] = useState(null);
  const [performance, setPerformance] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch children
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const { data } = await api.get("/parent/children");
        setChildren(data);
        if (data.length > 0) setSelectedChild(data[0]);
      } catch (err) {
        console.error("Error fetching children", err);
      }
    };
    fetchChildren();
  }, []);

  // 🔹 Fetch Child Data (Performance + Attendance)
  useEffect(() => {
    if (!selectedChild) return;

    const fetchChildData = async () => {
      try {
        setLoading(true);
        // Using your working attendance endpoint
        const [overviewRes, performanceRes, attendanceRes] = await Promise.all([
          api.get(`/parent/${selectedChild._id}/overview`),
          api.get(`/parent/${selectedChild._id}/performance`),
          api.get(`/attendance/parent/${selectedChild._id}`),
        ]);

        setOverview(overviewRes.data);
        setPerformance(performanceRes.data);
        setAttendance(attendanceRes.data);
      } catch (err) {
        console.error("Error fetching child data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChildData();
  }, [selectedChild]);

  // 🔹 Logic: Calculate Attendance Rate
  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(r => r.status === 'PRESENT').length / attendance.length) * 100)
    : 100;

  // 🔹 Logic: Risk detection
  const riskAlerts = [];
  if (overview?.overallAverage < 60) riskAlerts.push("Academic performance is currently below passing grade.");
  if (attendanceRate < 85 && attendance.length > 5) riskAlerts.push(`Attendance rate (${attendanceRate}%) is critically low.`);
  
  const recentAbsence = attendance.find(r => r.status === 'ABSENT');
  if (recentAbsence) riskAlerts.push(`Unexcused absence recorded on ${new Date(recentAbsence.date).toLocaleDateString()}.`);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Parent Dashboard</h2>
            <p className="text-gray-500 text-sm">Reviewing {selectedChild?.name}'s current standing</p>
          </div>

          {children.length > 0 && (
            <select
              value={selectedChild?._id}
              onChange={(e) => setSelectedChild(children.find(c => c._id === e.target.value))}
              className="border rounded-lg px-4 py-2 text-sm bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              {children.map((child) => (
                <option key={child._id} value={child._id}>{child.name}</option>
              ))}
            </select>
          )}
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500"><Percent className="animate-spin" /> Synchronizing data...</div>
        ) : (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard title="Grade Average" value={`${overview?.overallAverage ?? 0}%`} color="green" icon={CheckCircle} />
              <StatCard title="Attendance Rate" value={`${attendanceRate}%`} color={attendanceRate < 85 ? "red" : "blue"} icon={Percent} />
              <StatCard title="Total Courses" value={overview?.enrolledCourses} color="purple" icon={BookOpen} />
              <StatCard title="Subjects Scored" value={overview?.subjectsCount} color="orange" icon={AlertTriangle} />
            </div>

            {/* Risk Alerts */}
            {riskAlerts.length > 0 && (
              <div className="mb-8 space-y-2">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider ml-1">Critical Alerts</h4>
                {riskAlerts.map((alert, index) => (
                  <div key={index} className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded flex items-center gap-3 text-sm shadow-sm">
                    <AlertTriangle size={18} /> {alert}
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Chart/Bars */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-bold mb-6 text-gray-800">Subject Performance</h3>
                {performance.length === 0 ? (
                  <p className="text-gray-400 text-sm">No data available.</p>
                ) : (
                  <div className="space-y-5">
                    {performance.map((subject, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">{subject.subject}</span>
                          <span className={`font-bold ${subject.finalScore < 60 ? "text-red-500" : "text-gray-600"}`}>{subject.finalScore}%</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${subject.finalScore < 60 ? "bg-red-500" : "bg-blue-500"}`}
                            style={{ width: `${subject.finalScore}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attendance Mini-Log */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-bold mb-6 text-gray-800">Recent Attendance</h3>
                <div className="space-y-3">
                  {attendance.slice(0, 5).map((record, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-700">{new Date(record.date).toLocaleDateString()}</span>
                        <span className="text-[10px] text-gray-400 uppercase">{record.type}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase border ${
                        record.status === 'PRESENT' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                  ))}
                 <Link
  to="/parent/attendance"
  className="w-full text-center text-blue-500 text-xs font-bold mt-4 hover:underline block"
>
  View Full Attendance Report →
</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ParentDashboard;