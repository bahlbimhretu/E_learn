import { useEffect, useState } from "react";
import api from "../../api/axios";

const LessonAssignmentsStudent = ({ lessonId }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    if (!lessonId) return;
    loadAssignments();
  }, [lessonId]);

  const loadAssignments = async () => {
    try {
      const res = await api.get(`/assignments/lesson/${lessonId}`);
      setAssignments(res.data);

      // Fetch student's submissions
      const subRes = await api.get(`/submissions/my-submissions`);
      const submissionMap = {};
      subRes.data.forEach((s) => {
        submissionMap[s.assignment] = s;
      });

      setSubmissions(submissionMap);
    } catch (err) {
      console.error("Failed to load assignments:", err);
    }
  };

  const handleFileChange = (assignmentId, file) => {
    setSelectedFiles({
      ...selectedFiles,
      [assignmentId]: file
    });
  };

  const handleSubmit = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) return alert("Please select a file");

    try {
      setLoadingId(assignmentId);

      const formData = new FormData();
      formData.append("file", file);

      await api.post(
        `/submissions/${assignmentId}/submit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      await loadAssignments(); // refresh

    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoadingId(null);
    }
  };

  if (assignments.length === 0) return null;

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold mb-4">📚 Assignments</h3>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const submission = submissions[assignment._id];
          const isLate =
            submission &&
            new Date(submission.submittedAt) >
              new Date(assignment.dueDate);

          return (
            <div
              key={assignment._id}
              className="border rounded-lg p-4 bg-slate-50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">
                    {assignment.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Due:{" "}
                    {new Date(
                      assignment.dueDate
                    ).toLocaleString()}
                  </p>
                  {assignment.fileUrl && (
  <div className="mt-2">
    <a
      href={`http://localhost:5000/${assignment.fileUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline text-sm"
    >
      📎 Download Assignment File
    </a>
  </div>
)}
                </div>
                 
                {submission?.status === "graded" && (
                  <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                    Graded: {submission.marks}/{assignment.totalMarks}
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 mt-2">
                {assignment.description}
              </p>

              <div className="mt-4">
                {!submission ? (
                  <>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleFileChange(
                          assignment._id,
                          e.target.files[0]
                        )
                      }
                      className="mb-2"
                    />

                    <button
                      onClick={() =>
                        handleSubmit(assignment._id)
                      }
                      disabled={
                        loadingId === assignment._id
                      }
                      className={`px-4 py-2 rounded-lg text-white text-sm ${
                        loadingId === assignment._id
                          ? "bg-gray-400"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {loadingId === assignment._id
                        ? "Submitting..."
                        : "Submit Assignment"}
                    </button>
                  </>
                ) : (
                  <div className="mt-2">
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Submitted
                    </p>

                    {isLate && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Late Submission
                      </span>
                    )}

                    {submission.feedback && (
                      <p className="text-sm mt-2 text-gray-700">
                        Feedback: {submission.feedback}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LessonAssignmentsStudent;