import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const TeacherSubmissionsPage = () => {
  const { assignmentId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [assignmentId]);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get(`/submissions/assignment/${assignmentId}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Assignment Submissions</h2>
        
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="p-4 font-semibold">Student Name</th>
                <th className="p-4 font-semibold">Submitted At</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">File</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={sub._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{sub.student.name}</td>
                  <td className="p-4 text-sm">
                    {new Date(sub.submittedAt).toLocaleString()}
                    {sub.isLate && <span className="ml-2 text-red-500 text-xs font-bold">(LATE)</span>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${sub.status === 'graded' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <a 
                      href={`http://localhost:5000/${sub.fileUrl.replace(/\\/g, '/')}`} 
                      target="_blank" 
                      className="text-indigo-600 hover:underline text-sm font-medium"
                    >
                      📎 Download
                    </a>
                  </td>
                  
                
                </tr>
              ))}
            </tbody>
          </table>
          {submissions.length === 0 && <p className="p-10 text-center text-gray-500">No submissions yet.</p>}
        </div>
      </div>
    </Layout>
  );
};


export default TeacherSubmissionsPage;