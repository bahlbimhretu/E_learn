import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Save, CheckCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const HomeroomAttendance = () => {
  const { classId } = useParams();
const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [remarks, setRemarks] = useState({});
  const [sessionId, setSessionId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [search, setSearch] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const totalStudents = students.length;

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);

        const classRes = await api.get(`/classrooms/${classId}`);
        const studentsData = classRes.data.students || [];
        const yearLabel = classRes.data.academicYear;

        setStudents(studentsData);

        const sessionRes = await api.get(
          `/attendance/class/${classId}?date=${date}`
        );

        if (sessionRes.data?.session) {
          setSessionId(sessionRes.data.session._id);
          setSubmitted(true);

          const recordsMap = {};
          const remarksMap = {};

          sessionRes.data.records.forEach((r) => {
            recordsMap[r.student._id] = r.status;
            remarksMap[r.student._id] = r.remark || "";
          });

          setAttendance(recordsMap);
          setRemarks(remarksMap);
        } else {
          setSubmitted(false);

          const createRes = await api.post("/attendance/session", {
            classId,
            sessionDate: date,
            sessionType: "DAILY",
            academicYearId: yearLabel,
          });

          setSessionId(createRes.data._id);

          const defaultMap = {};
          studentsData.forEach((s) => {
            defaultMap[s._id] = "PRESENT";
          });

          setAttendance(defaultMap);
          setRemarks({});
        }
      } catch (err) {
        console.error(
          "Attendance Loading Error:",
          err.response?.data || err.message
        );
      } finally {
        setLoading(false);
      }
    };

    if (classId) loadAttendance();
  }, [classId, date]);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId, remark) => {
    setRemarks((prev) => ({ ...prev, [studentId]: remark }));
  };

  const markAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s._id] = status;
    });
    setAttendance(updated);
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const presentCount = Object.values(attendance).filter(
    (s) => s === "PRESENT"
  ).length;

  const absentCount = Object.values(attendance).filter(
    (s) => s === "ABSENT"
  ).length;

  const lateCount = Object.values(attendance).filter(
    (s) => s === "LATE"
  ).length;

  const excusedCount = Object.values(attendance).filter(
    (s) => s === "EXCUSED"
  ).length;

  const attendanceRate = totalStudents
    ? ((presentCount / totalStudents) * 100).toFixed(1)
    : 0;

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const records = Object.keys(attendance).map((id) => ({
        student: id,
        status: attendance[id],
        remark: remarks[id] || "",
      }));

      await api.post(`/attendance/session/${sessionId}/records`, {
        records,
      });

      setSubmitted(true);
      alert("Attendance saved successfully!");
    } catch (err) {
      console.error("Save Error:", err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="p-6">Loading attendance...</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">
            Homeroom Attendance
          </h1>
          <button
  onClick={() =>
    navigate(`/homeroom/attendance/report/${classId}`)
  }
  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
>
  View Monthly Report
</button>
  <button
  onClick={() =>
    navigate(`/teacher`)
  }
  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
>
back to home
</button>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6 text-center">
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm">Total</p>
            <p className="font-bold">{totalStudents}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-lg">
            <p className="text-sm">Present</p>
            <p className="font-bold">{presentCount}</p>
          </div>
          <div className="p-3 bg-red-100 rounded-lg">
            <p className="text-sm">Absent</p>
            <p className="font-bold">{absentCount}</p>
          </div>
          <div className="p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm">Late</p>
            <p className="font-bold">{lateCount}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-lg">
            <p className="text-sm">Excused</p>
            <p className="font-bold">{excusedCount}</p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-lg">
            <p className="text-sm">Attendance %</p>
            <p className="font-bold">{attendanceRate}%</p>
          </div>
        </div>

        {/* Search + Bulk */}
        <div className="flex flex-wrap justify-between gap-3 mb-4">
          <input
            type="text"
            placeholder="Search student..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg w-64"
          />

          <div className="flex flex-wrap gap-2">
            <button onClick={() => markAll("PRESENT")} className="px-3 py-1 bg-green-600 text-white rounded">
              All Present
            </button>
            <button onClick={() => markAll("ABSENT")} className="px-3 py-1 bg-red-600 text-white rounded">
              All Absent
            </button>
            <button onClick={() => markAll("LATE")} className="px-3 py-1 bg-yellow-500 text-white rounded">
              All Late
            </button>
            <button onClick={() => markAll("EXCUSED")} className="px-3 py-1 bg-blue-600 text-white rounded">
              All Excused
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Student</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-left">Remark</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => {
                const status = attendance[student._id] || "PRESENT";

                return (
                  <tr
                    key={student._id}
                    className={`border-t ${
                      status === "ABSENT"
                        ? "bg-red-50"
                        : status === "LATE"
                        ? "bg-yellow-50"
                        : ""
                    }`}
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{student.name}</td>

                    <td className="p-3 text-center">
                      <select
                        value={status}
                        disabled={submitted}
                        onChange={(e) =>
                          handleStatusChange(student._id, e.target.value)
                        }
                        className="px-2 py-1 border rounded"
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                        <option value="EXCUSED">Excused</option>
                      </select>
                    </td>

                    <td className="p-3">
                      <input
                        type="text"
                        disabled={submitted}
                        value={remarks[student._id] || ""}
                        onChange={(e) =>
                          handleRemarkChange(
                            student._id,
                            e.target.value
                          )
                        }
                        className="w-full border px-2 py-1 rounded"
                        placeholder="Optional remark"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Save */}
        {!submitted && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Attendance"}
            </button>
          </div>
        )}

        {submitted && (
          <div className="mt-6 text-right text-green-600 font-semibold">
            Attendance Submitted ✔
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HomeroomAttendance;