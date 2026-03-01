import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const StudentAttendance = () => {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [academicYear, setAcademicYear] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================
     Fetch Academic Years
  ========================== */
  const fetchAcademicYears = async () => {
    try {
      const res = await api.get("/attendance/academic-years");
      setAcademicYears(res.data || []);
    } catch (error) {
      console.error("Error fetching academic years:", error);
    }
  };

  /* =========================
     Fetch Attendance
  ========================== */
  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await api.get("/attendance/student", {
        params: { academicYear },
      });

      setRecords(res.data?.records || []);
      setSummary(res.data?.summary || null);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setRecords([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [academicYear]);

  /* =========================
     Group Records By Month
  ========================== */
  const groupedByMonth = records.reduce((acc, record) => {
    if (!record.date) return acc;

    const date = new Date(record.date);
    const monthKey = date.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }

    acc[monthKey].push(record);
    return acc;
  }, {});

  return (
    <Layout>
      <div className="p-6">

        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">
          My Daily Attendance
        </h1>

        {/* Filter */}
        <div className="mb-6">
          <select
            className="border p-2 rounded"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
          >
            <option value="">All Academic Years</option>
            {academicYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading attendance...
          </div>
        )}

        {/* Summary */}
        {!loading && summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card title="Total Days" value={summary.total ?? 0} />
              <Card title="Present" value={summary.present ?? 0} />
              <Card title="Absent" value={summary.absent ?? 0} />
              <Card title="Late" value={summary.late ?? 0} />
              <Card title="Excused" value={summary.excused ?? 0} />
            </div>

            <div className="mb-8">
              <p className="text-lg font-semibold">
                Attendance Rate: {summary.percentage ?? 0}%
              </p>
            </div>
          </>
        )}

        {/* Monthly Groups */}
        {!loading &&
          Object.keys(groupedByMonth).map((month) => (
            <div key={month} className="mb-10">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                {month}
              </h2>

              <div className="bg-white shadow rounded overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByMonth[month].map((record) => (
                      <tr key={record._id} className="border-t">
                        <td className="p-3">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={record.status} />
                        </td>
                        <td className="p-3">
                          {record.remark || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        {!loading && records.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No attendance records found.
          </div>
        )}
      </div>
    </Layout>
  );
};

/* =========================
   Summary Card
========================= */
const Card = ({ title, value }) => (
  <div className="bg-white shadow rounded p-4 text-center">
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

/* =========================
   Status Badge
========================= */
const StatusBadge = ({ status }) => {
  const normalized = status?.toUpperCase();

  let colorClasses = "bg-gray-200 text-gray-700";

  if (normalized === "PRESENT") {
    colorClasses = "bg-green-100 text-green-700";
  } else if (normalized === "ABSENT") {
    colorClasses = "bg-red-100 text-red-700";
  } else if (normalized === "LATE") {
    colorClasses = "bg-yellow-100 text-yellow-700";
  } else if (normalized === "EXCUSED") {
    colorClasses = "bg-blue-100 text-blue-700";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colorClasses}`}>
      {status}
    </span>
  );
};

export default StudentAttendance;