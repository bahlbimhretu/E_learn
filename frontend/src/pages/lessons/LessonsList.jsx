import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const LessonsList = () => {
  const { courseId } = useParams(); // CourseInstance ID
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // ✅ Load the course instance info
        const courseRes = await api.get(`/courses/teacher/course-instances/${courseId}`);
        setCourse(courseRes.data);

        // ✅ Load lessons for this course instance
        const lessonsRes = await api.get(`/lessons/course/${courseId}`);
        setLessons(lessonsRes.data);
      } catch (err) {
        console.error("Error loading lessons:", err);
        setError("Failed to load course or lessons");
        setLessons([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId]);

  const deleteLesson = async (id) => {
    if (!confirm("Are you sure you want to delete this lesson?")) return;

    try {
      await api.delete(`/lessons/${id}`);
      setLessons(lessons.filter((l) => l._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete lesson");
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="p-4">Loading lessons...</p>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <p className="p-4 text-red-600">{error}</p>
      </Layout>
    );

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-2">
        Lessons for {course?.courseTemplate?.title || "Course"}
      </h1>

      <div className="flex justify-end mb-4">
        <Link
          to={`/teacher/courses/${courseId}/lessons/new`}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Lesson
        </Link>
      </div>

      {lessons.length === 0 ? (
        <p>No lessons yet.</p>
      ) : (
        <div className="space-y-3">
          {lessons
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((lesson) => (
              <div
                key={lesson._id}
                className="p-4 bg-white shadow rounded border flex justify-between items-center"
              >
                <div>
                  <h2 className="font-bold text-lg">
                    {lesson.order}. {lesson.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {lesson.videoUrl ? "🎬 Video lesson" : "📝 Text lesson"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/teacher/courses/${courseId}/lessons/edit/${lesson._id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteLesson(lesson._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </Layout>
  );
};

export default LessonsList;
