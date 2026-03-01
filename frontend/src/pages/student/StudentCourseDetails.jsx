import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";
import LessonViewer from "./LessonViewer";
import Layout from "../../layout/Layout";

const StudentCourseDetails = () => {
  const { id } = useParams(); // course instance ID
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quizLoading, setQuizLoading] = useState(false);
  const [quizExists, setQuizExists] = useState(false);
  const [quizId, setQuizId] = useState(null);

  // NEW — Marks
  const [view, setView] = useState("lessons"); // lessons | marks
  const [marksData, setMarksData] = useState(null);
  const [semester, setSemester] = useState(1);
  const [marksLoading, setMarksLoading] = useState(false);

  // =============================
  // Load course + lessons
  // =============================
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const [courseRes, lessonsRes] = await Promise.all([
          api.get(`/student/course-instances/${id}`),
          api.get(`/student/course-instances/${id}/lessons`),
        ]);

        setCourse(courseRes.data);
        setLessons(lessonsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [id]);

  // =============================
  // Check quiz for current lesson
  // =============================
  useEffect(() => {
    const checkQuiz = async () => {
      if (!lessons.length) return;

      const lessonId = lessons[currentIndex]?._id;
      if (!lessonId) return;

      setQuizLoading(true);
      setQuizExists(false);
      setQuizId(null);

      try {
        const res = await api.get(`/student/lessons/${lessonId}/quiz`);

        if (res.data?._id) {
          setQuizExists(true);
          setQuizId(res.data._id);
        }
      } catch (err) {
        setQuizExists(false);
        setQuizId(null);
      } finally {
        setQuizLoading(false);
      }
    };

    checkQuiz();
  }, [lessons, currentIndex]);

  const handleStartQuiz = () => {
    if (!quizId) return;
    navigate(`/student/exercise-quiz/${quizId}`);
  };

  // =============================
  // Load student marks
  // =============================
  const loadMarks = async () => {
    try {
      setMarksLoading(true);

      const res = await api.get(
        `/student/course-instances/${id}/marks`
      );

      setMarksData(res.data);
    } catch (err) {
      console.error("Failed to load marks", err);
    } finally {
      setMarksLoading(false);
    }
  };

  // =============================
  // Loading state
  // =============================
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!course) return null;

  return (
    <Layout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Course Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            {course.courseName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {course.teacherName} • Grade {course.grade} • Section{" "}
            {course.section}
          </p>

          {/* Tabs */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => setView("lessons")}
              className={`px-4 py-2 rounded ${
                view === "lessons"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              Lessons
            </button>

            <button
              onClick={() => {
                setView("marks");
                loadMarks();
              }}
              className={`px-4 py-2 rounded ${
                view === "marks"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              My Marks
            </button>
          </div>
        </div>

        {/* ============================= */}
        {/* LESSON VIEW */}
        {/* ============================= */}
        {view === "lessons" ? (
          lessons.length ? (
            <>
             <LessonViewer
  lessons={lessons}
  currentIndex={currentIndex}
  setCurrentIndex={setCurrentIndex}
  courseId={course._id}
/>

              <div className="mt-6">
                {quizLoading ? (
                  <p>Checking for quiz...</p>
                ) : quizExists ? (
                  <button
                    onClick={handleStartQuiz}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Start Quiz
                  </button>
                ) : (
                  <p className="text-gray-500">
                    No quiz available for this lesson
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              No lessons available yet.
            </p>
          )
        ) : (
          /* ============================= */
          /* MARKS VIEW */
          /* ============================= */
          <div>
            {marksLoading ? (
              <p>Loading marks...</p>
            ) : marksData ? (
              <>
                <div className="mb-4">
                  <label className="mr-2 font-medium">
                    Semester:
                  </label>
                  <select
                    value={semester}
                    onChange={(e) =>
                      setSemester(Number(e.target.value))
                    }
                    className="border p-2 rounded"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>

                {(() => {
                  const sem =
                    semester === 1
                      ? marksData.semester1
                      : marksData.semester2;

                  return (
                    <table className="w-full border text-sm">
                      <tbody>
                        <tr>
                          <td className="border p-2">Quiz 1</td>
                          <td className="border p-2">
                            {sem?.quiz1 || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">Mid</td>
                          <td className="border p-2">
                            {sem?.mid || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">Quiz 2</td>
                          <td className="border p-2">
                            {sem?.quiz2 || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">
                            Participation
                          </td>
                          <td className="border p-2">
                            {sem?.participation || 0}
                          </td>
                        </tr>
                        <tr>
                          <td className="border p-2">Final</td>
                          <td className="border p-2">
                            {sem?.final || 0}
                          </td>
                        </tr>
                        <tr className="font-bold bg-gray-100">
                          <td className="border p-2">Total</td>
                          <td className="border p-2">
                            {sem?.total || 0}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  );
                })()}

                <div className="mt-6 text-lg font-bold">
                  Year Average:{" "}
                  {marksData.yearFinalScore || 0}
                </div>
              </>
            ) : (
              <p>No marks available yet.</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentCourseDetails;
