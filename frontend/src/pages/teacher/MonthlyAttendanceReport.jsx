import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { useNavigate } from "react-router-dom";

const MonthlyAttendanceReport = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [data, setData] = useState([]);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/attendance/report/${classId}?month=${month}`
        );

        setData(res.data.students || []);
        setTotalDays(res.data.totalDays || 0);
      } catch (err) {
        console.error("Report Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (classId) fetchReport();
  }, [classId, month]);

  const filteredStudents = useMemo(() => {
    return data.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  if (loading)
    return (
      <Layout>
        <p className="p-6">Loading monthly report...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">
            Monthly Attendance Report
          </h1>
        <button
  onClick={() =>
    navigate(`/teacher/homeroom/attendance/${classId}`)
  }
  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
>
  Back to Daily
</button>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Summary */}
        <div className="mb-6">
          <div className="p-4 bg-indigo-100 rounded-lg text-center">
            <p className="text-sm text-gray-700">
              Total School Days This Month
            </p>
            <p className="text-2xl font-bold">{totalDays}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-64"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-center">Present</th>
                <th className="p-3 text-center">Absent</th>
                <th className="p-3 text-center">Late</th>
                <th className="p-3 text-center">Excused</th>
                <th className="p-3 text-center">Attendance %</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const attendancePercent = totalDays
                  ? (
                      (student.present / totalDays) *
                      100
                    ).toFixed(1)
                  : 0;

                const isWarning = attendancePercent < 75;

                return (
                  <tr
                    key={student._id}
                    className={`border-t ${
                      isWarning ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{student.name}</td>
                    <td className="p-3 text-center text-green-600 font-semibold">
                      {student.present}
                    </td>
                    <td className="p-3 text-center text-red-600 font-semibold">
                      {student.absent}
                    </td>
                    <td className="p-3 text-center text-yellow-600 font-semibold">
                      {student.late}
                    </td>
                    <td className="p-3 text-center text-blue-600 font-semibold">
                      {student.excused}
                    </td>
                    <td className="p-3 text-center font-bold">
                      {attendancePercent}%
                    </td>
                    <td className="p-3 text-center">
                      {isWarning ? (
                        <span className="px-2 py-1 bg-red-500 text-white rounded text-xs">
                          Warning
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-500 text-white rounded text-xs">
                          Good
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-6 text-center text-gray-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default MonthlyAttendanceReport;