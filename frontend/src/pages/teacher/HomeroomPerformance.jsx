import { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

const HomeroomPerformance = () => {
  const [data, setData] = useState(null);
  const [semester, setSemester] = useState("final");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("rank");
const navigate = useNavigate();
  useEffect(() => {
    fetchPerformance();
  }, [semester]);

  const fetchPerformance = async () => {
  try {
    setLoading(true);
    setError("");

    const query =
      semester === "final" ? "" : `?semester=${semester}`;

    const res = await api.get(
      `/homeroom/performance${query}`
    );

    setData(res.data);
  } catch (err) {
    console.error(err);
    setError("Failed to load performance data.");
  } finally {
    setLoading(false);
  }
};

  const sortedStudents = () => {
    if (!data?.students) return [];

    const list = [...data.students];

    if (sortBy === "rank") return list.sort((a, b) => a.rank - b.rank);
    if (sortBy === "average") return list.sort((a, b) => b.average - a.average);
    if (sortBy === "name") return list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  };

  const students = sortedStudents();

  return (
    <Layout>
      <div>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Homeroom Performance</h2>
            <p className="text-sm text-gray-500">
              Class analytics & ranking
            </p>
          </div>

          {/* Semester Filter */}
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border rounded px-3 py-2 text-sm bg-white"
          >
            <option value="final">Final Average</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
          </select>
        </div>

        {loading && <p>Loading...</p>}

        {error && (
          <p className="text-red-600 font-medium">{error}</p>
        )}

        {!loading && !error && data && (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
              <StatCard
                label="Students"
                value={data.totalStudents || 0}
              />
              <StatCard
                label="Class Average"
                value={`${data.classAverage || 0}%`}
              />
              <StatCard
                label="At Risk"
                value={data.atRiskCount || 0}
                danger
              />
              <StatCard
                label="Top Score"
                value={`${students[0]?.average || 0}%`}
              />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-xl shadow border">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-semibold">Student Ranking</h3>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border px-2 py-1 rounded text-sm"
                >
                  <option value="rank">Sort by Rank</option>
                  <option value="average">Sort by Average</option>
                  <option value="name">Sort by Name</option>
                </select>
              </div>

              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="p-3 text-left">Rank</th>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Average</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td className="p-4 text-center" colSpan="4">
                        No student data available
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr
  key={s.studentId}
  onClick={() =>
    navigate(`/teacher/homeroom/student/${s.studentId}`)
  }
  className="border-t hover:bg-gray-50 cursor-pointer"
>
                        <td className="p-3 font-semibold">{s.rank}</td>
                        <td className="p-3">{s.name}</td>
                        <td
                          className={`p-3 font-semibold ${
                            s.atRisk ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          {s.average}%
                        </td>
                        <td className="p-3">
                          {s.atRisk ? (
                            <span className="text-red-600 font-medium">
                              At Risk
                            </span>
                          ) : (
                            <span className="text-green-600 font-medium">
                              Good
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
             
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

const StatCard = ({ label, value, danger }) => (
  <div className="bg-white p-5 rounded-xl shadow border">
    <p className="text-sm text-gray-500">{label}</p>
    <p
      className={`text-2xl font-bold mt-2 ${
        danger ? "text-red-600" : "text-gray-800"
      }`}
    >
      {value}
    </p>
  </div>
);

export default HomeroomPerformance;