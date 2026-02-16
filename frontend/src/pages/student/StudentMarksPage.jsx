import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const StudentMarksPage = () => {
  const { courseId } = useParams();

  const [data, setData] = useState(null);
  const [semester, setSemester] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarks();
  }, [courseId]);

  const loadMarks = async () => {
    try {
      const res = await api.get(
        `/courses/student/course-instances/${courseId}/marks`
      );
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Layout><div className="p-8">Loading...</div></Layout>;
  if (!data) return <Layout><div className="p-8">No Data</div></Layout>;

  const sem = semester === 1 ? data.semester1 : data.semester2;

  return (
    <Layout>
      <div className="bg-white p-6 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">My Marks</h1>

        <div className="mb-4">
          <p><strong>Subject:</strong> {data.courseInfo.subject}</p>
          <p><strong>Grade:</strong> {data.courseInfo.grade} {data.courseInfo.section}</p>
          <p><strong>Academic Year:</strong> {data.courseInfo.academicYear}</p>
        </div>

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

        <table className="w-full border text-sm">
          <tbody>
            <tr><td className="border p-2">Quiz 1</td><td className="border p-2">{sem.quiz1 || 0}</td></tr>
            <tr><td className="border p-2">Mid</td><td className="border p-2">{sem.mid || 0}</td></tr>
            <tr><td className="border p-2">Quiz 2</td><td className="border p-2">{sem.quiz2 || 0}</td></tr>
            <tr><td className="border p-2">Participation</td><td className="border p-2">{sem.participation || 0}</td></tr>
            <tr><td className="border p-2">Final</td><td className="border p-2">{sem.final || 0}</td></tr>
            <tr className="font-bold bg-gray-100">
              <td className="border p-2">Total</td>
              <td className="border p-2">{sem.total || 0}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-4 text-lg font-bold">
          Year Average: {data.yearFinalScore}
        </div>
      </div>
    </Layout>
  );
};

export default StudentMarksPage;
