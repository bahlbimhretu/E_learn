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

  // Load course + lessons
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

  // Check quiz for current lesson
  useEffect(() => {
    const checkQuiz = async () => {
      if (!lessons.length) return;

      const lessonId = lessons[currentIndex]?._id;
      if (!lessonId) return;

      setQuizLoading(true);
      setQuizExists(false);
      setQuizId(null);

      try {
        const res = await api.get(`/lessons/${lessonId}/quiz`);

        if (res.data?._id) {
          setQuizExists(true);
          setQuizId(res.data._id); // ✅ store quizId
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            {course.courseName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {course.teacherName} • Grade {course.grade} • Section{" "}
            {course.section}
          </p>
        </div>

        {lessons.length ? (
          <>
            <LessonViewer
              lessons={lessons}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
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
          <p className="text-gray-500">No lessons available yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default StudentCourseDetails;
