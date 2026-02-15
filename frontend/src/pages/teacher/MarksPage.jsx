import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios.js";

const MarksPage = () => {
  const { id } = useParams();

  const [semester, setSemester] = useState(1);
  const [courseInfo, setCourseInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, [semester]);

  const fetchMarks = async () => {
    setLoading(true);
    const { data } = await api.get(
      `/teacher/course/${id}/marks?semester=${semester}`
    );
    setCourseInfo(data.courseInfo);
    setStudents(data.students);
    setLoading(false);
  };

  const handleChange = (studentId, field, value) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === studentId
          ? { ...s, [field]: Number(value) }
          : s
      )
    );
  };

  const calculateTotal = (s) =>
    (s.quiz1 || 0) +
    (s.mid || 0) +
    (s.quiz2 || 0) +
    (s.participation || 0) +
    (s.final || 0);

  const handleSave = async () => {
    await api.put(`/teacher/course/${id}/marks`, {
      semester,
      marks: students,
    });

    fetchMarks();
    alert("Marks saved successfully");
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          {courseInfo.subject}
        </h2>
        <p>
          Grade {courseInfo.grade}
          {courseInfo.section} | {courseInfo.academicYear}
        </p>
      </div>

      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setSemester(1)}
          className={`px-4 py-2 rounded ${
            semester === 1 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Semester 1
        </button>
        <button
          onClick={() => setSemester(2)}
          className={`px-4 py-2 rounded ${
            semester === 2 ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Semester 2
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Student</th>
              <th className="border p-2">Quiz1</th>
              <th className="border p-2">Mid</th>
              <th className="border p-2">Quiz2</th>
              <th className="border p-2">Participation</th>
              <th className="border p-2">Final</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={s.studentId} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2 text-left">
                  {s.name}
                </td>

                {["quiz1", "mid", "quiz2", "participation", "final"].map(
                  (field) => (
                    <td key={field} className="border p-1">
                      <input
                        type="number"
                        value={s[field] || ""}
                        onChange={(e) =>
                          handleChange(
                            s.studentId,
                            field,
                            e.target.value
                          )
                        }
                        className="w-16 border rounded px-1"
                      />
                    </td>
                  )
                )}

                <td className="border p-2 font-semibold">
                  {calculateTotal(s)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSave}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Save Marks
      </button>
    </div>
  );
};

export default MarksPage;
