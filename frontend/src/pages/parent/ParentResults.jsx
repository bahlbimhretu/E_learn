import { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";

const ParentResults = () => {
  const { user } = useContext(AuthContext);

  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
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

  // 🔹 Fetch performance when child changes
  useEffect(() => {
    if (!selectedChild) return;

    const fetchPerformance = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(
          `/parent/${selectedChild._id}/performance`
        );

        setPerformance(data);
      } catch (err) {
        console.error("Error fetching performance", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [selectedChild]);

  // 🔹 Calculate overall average
  const overallAverage =
    performance.length > 0
      ? (
          performance.reduce(
            (sum, item) => sum + (item.finalScore || 0),
            0
          ) / performance.length
        ).toFixed(2)
      : null;

  return (
    <Layout>
      <div>
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            Performance & Results
          </h2>
          <p className="text-gray-500 text-sm">
            View detailed academic results
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
                  {child.name} (Grade {child.studentProfile?.grade} -{" "}
                  {child.studentProfile?.section})
                </option>
              ))}
            </select>
          </div>
        )}

        {loading ? (
          <p>Loading results...</p>
        ) : performance.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow-sm border text-gray-500">
            No results available yet.
          </div>
        ) : (
          <>
            {/* Overall Summary Card */}
            <div className="mb-6 bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-sm text-gray-500">
                Overall Year Average
              </p>
              <p
                className={`text-3xl font-bold mt-2 ${
                  overallAverage < 60
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {overallAverage}%
              </p>
            </div>

            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">Subject</th>
                    <th className="px-6 py-3 text-center">
                      Semester 1
                    </th>
                    <th className="px-6 py-3 text-center">
                      Semester 2
                    </th>
                    <th className="px-6 py-3 text-center">
                      Final Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {performance.map((subject, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {subject.subject}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {subject.semester1 ?? "--"}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {subject.semester2 ?? "--"}
                      </td>

                      <td
                        className={`px-6 py-4 text-center font-semibold ${
                          subject.finalScore < 60
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {subject.finalScore ?? "--"}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ParentResults;
