import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";
import LessonQuiz from "../lessons/LessonQuiz";

const CourseDetails = () => {
  const { id: courseId } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState({});
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Load course and lessons on mount
  useEffect(() => {
    if (authLoading || !courseId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        await loadCourse();
        await loadLessons(); 
        await checkEnrollment();
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, authLoading]);

  // Fetch course instance
  const loadCourse = async () => {
    try {
      const res = await api.get(`/courses/teacher/course-instances/${courseId}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Error loading course:", err);
      setCourse(null);
    }
  };

  // Fetch lessons and their materials
  const loadLessons = async () => {
    try {
      const res = await api.get(`/lessons/course/${courseId}`);
      const sortedLessons = res.data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setLessons(sortedLessons);

      // Fetch materials for each lesson
      const lessonMaterials = {};
      for (const lesson of sortedLessons) {
        const matRes = await api.get(`/materials/lesson/${lesson._id}`);
        lessonMaterials[lesson._id] = matRes.data || [];
      }
      setMaterials(lessonMaterials);
    } catch (err) {
      console.error("Error loading lessons or materials:", err);
      setLessons([]);
      setMaterials({});
    }
  };

  // Check if student is enrolled
  const checkEnrollment = async () => {
    if (!user || user.role !== "student") {
      setEnrolled(false);
      return;
    }

    try {
      const res = await api.get(`/enroll/check/${courseId}`);
      setEnrolled(res.data.enrolled || false);
    } catch {
      setEnrolled(false);
    }
  };

  // Enroll student
  const enrollNow = async () => {
    if (!user) {
      setMessage("Please login to enroll");
      return;
    }

    try {
      await api.post(`/enroll/${courseId}`);
      setEnrolled(true);
      setMessage("Enrolled successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to enroll");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse">Loading course details...</div>
        </div>
      </Layout>
    );
  }

  if (!course) {
    return (
      <Layout>
        <div className="text-center p-8">
          <p className="text-red-600 text-xl">Course not found</p>
          <Link to="/courses" className="text-blue-600 mt-4 inline-block">
            Back to courses
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* COURSE HEADER */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {course.courseTemplate?.name || "No Title"}
        </h1>
        <p className="text-gray-600 mt-2">
          {course.courseTemplate?.description || "No Description"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {/* TEACHER MARK ENTRY */}
{(user?.role === "teacher" || user?.role === "admin") && (
  <div className="mt-6">
    <Link
      to={`/teacher/course/${courseId}/marks`}
      className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
    >
      📊 Mark Entry
    </Link>
  </div>
)}

          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {course.courseTemplate?.subject || "General"}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Instructor: {course.teacher?.name || "Unknown"}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Grade {course.grade} – {course.section}
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Academic Year: {course.academicYear}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
            {course.students?.length || 0} students enrolled
          </span>
        </div>

        {/* STUDENT ENROLLMENT */}
        {user?.role === "student" && (
          <div className="mt-6">
            {!enrolled ? (
              <button
                onClick={enrollNow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Enroll Now
              </button>
            ) : (
              <p className="text-green-600 font-medium">
                ✓ You are enrolled in this course
              </p>
            )}
            {message && (
              <p
                className={`mt-2 ${
                  message.includes("success") ? "text-green-600" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* LESSONS & MATERIALS */}
      <div className="space-y-6">
        {lessons.length === 0 && (
          <p className="text-gray-500 italic">No lessons available yet.</p>
        )}

        {lessons.map((lesson) => (
          <div key={lesson._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Lesson {lesson.order}: {lesson.title}
              </h2>
              {(user?.role === "teacher" || user?.role === "admin") && (
                <div className="flex gap-2">
                  {lesson.createdBy?._id === user?._id && (
                    <Link
                      to={`/teacher/courses/${courseId}/lessons/edit/${lesson._id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                  )}
                  <Link
                    to={`/teacher/courses/${courseId}/lessons/${lesson._id}/materials/upload`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg font-medium transition-colors"
                  >
                    + Upload Material
                  </Link>
                </div>
              )}
            </div>
            {lesson.description && (
              <p className="text-gray-600 mb-4">{lesson.description}</p>
            )}

            {/* MATERIALS */}
            {materials[lesson._id]?.length > 0 ? (
              <div className="space-y-2">
                {materials[lesson._id].map((material) => (
                  <div
                    key={material._id}
                    className="flex justify-between items-center p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium">{material.title}</span>
                    <a
                      href={material.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1 rounded-lg font-medium transition-colors"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No materials uploaded yet.</p>
            )}

            {/* QUIZ BUILDER */}
            <LessonQuiz lessonId={lesson._id} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default CourseDetails;
