import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

const LessonAssignments = ({ lessonId, courseId }) => {
  const { user } = useContext(AuthContext);

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, [lessonId]);

  const loadAssignments = async () => {
    try {
      const res = await api.get(`/assignments/lesson/${lessonId}`);
      setAssignments(res.data);
    } catch (err) {
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-gray-500">Loading assignments...</p>;

  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          📚 Assignments
        </h3>

        {user?.role === "teacher" && (
          <Link
            to={`/teacher/courses/${courseId}/lessons/${lessonId}/assignments/create`}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            + Create Assignment
          </Link>
        )}
      </div>

      {assignments.length === 0 ? (
        <p className="text-gray-500 italic">No assignments yet.</p>
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <div
              key={assignment._id}
              className="border border-gray-200 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">{assignment.title}</h4>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>

                {user?.role === "teacher" && (
                  <Link
                    to={`/teacher/assignments/${assignment._id}/submissions`}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Submissions
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonAssignments;
