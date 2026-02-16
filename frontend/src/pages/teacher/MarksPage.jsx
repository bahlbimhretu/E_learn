import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const MarksPage = () => {
  const { courseId } = useParams();

  const [students, setStudents] = useState([]);
  const [semester, setSemester] = useState(1);
  const [courseInfo, setCourseInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarks();
  }, [courseId, semester]);

  const loadMarks = async () => {
    try {
      setLoading(true);

      const res =await api.get(
  `/courses/teacher/course-instances/${courseId}/marks?semester=${semester}`
);


      setStudents(res.data.students);
      setCourseInfo(res.data.courseInfo);
    } catch (err) {
      console.error("Error loading marks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, field, value) => {
    const updated = [...students];
    updated[index][field] = Number(value) || 0;

    // Auto calculate total on frontend
    updated[index].total =
      (updated[index].quiz1 || 0) +
      (updated[index].mid || 0) +
      (updated[index].quiz2 || 0) +
      (updated[index].participation || 0) +
      (updated[index].final || 0);

    setStudents(updated);
  };

  const handleSave = async () => {
    try {
      await api.put(
  `/courses/teacher/course-instances/${courseId}/marks`,
        {
          semester,
          marks: students.map((s) => ({
            studentId: s.studentId,
            quiz1: s.quiz1 || 0,
            mid: s.mid || 0,
            quiz2: s.quiz2 || 0,
            participation: s.participation || 0,
            final: s.final || 0,
          })),
        }
      );

      alert("Marks updated successfully!");
      loadMarks(); // reload after save
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to update marks");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8 text-center">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Mark Entry</h1>

        {/* Course Info */}
        {courseInfo && (
          <div className="mb-4 text-gray-700">
            <p><strong>Subject:</strong> {courseInfo.subject}</p>
            <p>
              <strong>Grade:</strong> {courseInfo.grade}{" "}
              {courseInfo.section}
            </p>
            <p>
              <strong>Academic Year:</strong>{" "}
              {courseInfo.academicYear}
            </p>
          </div>
        )}

        {/* Semester Selector */}
        <div className="mb-4">
          <label className="mr-2 font-medium">Semester:</label>
          <select
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value={1}>Semester 1</option>
            <option value={2}>Semester 2</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Student</th>
                <th className="border p-2">Quiz1 (10)</th>
                <th className="border p-2">Mid (20)</th>
                <th className="border p-2">Quiz2 (10)</th>
                <th className="border p-2">Participation (10)</th>
                <th className="border p-2">Final (50)</th>
                <th className="border p-2">Total (100)</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={student.studentId}>
                  <td className="border p-2 font-medium">
                    {student.name}
                  </td>

                  {["quiz1", "mid", "quiz2", "participation", "final"].map(
                    (field) => (
                      <td key={field} className="border p-2">
                        <input
                          type="number"
                          value={student[field]}
                          onChange={(e) =>
                            handleChange(index, field, e.target.value)
                          }
                          className="w-20 border p-1 rounded"
                        />
                      </td>
                    )
                  )}

                  <td className="border p-2 font-bold">
                    {student.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Save Marks
        </button>
      </div>
    </Layout>
  );
};

export default MarksPage;
