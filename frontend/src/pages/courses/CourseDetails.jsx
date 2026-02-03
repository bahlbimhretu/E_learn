import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (authLoading) return; // wait for auth to load
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        await Promise.all([
          loadCourse(),
          loadLessons(),
          loadMaterials(),
          checkEnrollment(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, authLoading]);

  // Load the CourseInstance
  const loadCourse = async () => {
    try {
      const res = await api.get(`/courses/teacher/course-instances/${id}`);
      setCourse(res.data);
    } catch (err) {
      console.error("Error loading course:", err);
      setCourse(null);
    }
  };

  // Load lessons associated with this course
  const loadLessons = async () => {
    try {
      const res = await api.get(`/lessons/course/${id}`);
      setLessons(res.data);
    } catch (err) {
      console.error("Error loading lessons:", err);
      setLessons([]);
    }
  };

  // Load materials associated with this course
  const loadMaterials = async () => {
    try {
      const res = await api.get(`/materials/course/${id}`);
      setMaterials(res.data);
    } catch (err) {
      console.error("Error loading materials:", err);
      setMaterials([]);
    }
  };

  // Check if the current student is enrolled
  const checkEnrollment = async () => {
    if (!user || user.role !== "student") {
      setEnrolled(false);
      return;
    }

    try {
      const res = await api.get(`/enroll/check/${id}`);
      setEnrolled(res.data.enrolled || false);
    } catch {
      setEnrolled(false);
    }
  };

  // Enroll the current student
  const enrollNow = async () => {
    if (!user) {
      setMessage("Please login to enroll");
      return;
    }

    try {
      await api.post(`/enroll/${id}`);
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
          {course.courseTemplate?.name|| "No Title"}
        </h1>
        <p className="text-gray-600 mt-2">
          {course.courseTemplate?.description || "No Description"}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
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

        {/* Enrollment Section for students */}
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

      {/* LESSONS */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Course Lessons</h2>
          {(user?.role === "teacher" || user?.role === "admin") && (
            <Link
              to={`/teacher/courses/${id}/lessons/new`}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Add Lesson
            </Link>
          )}
        </div>

        {lessons.length === 0 ? (
          <p className="text-gray-500 italic">No lessons available yet.</p>
        ) : (
          <div className="space-y-3">
            {lessons
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((lesson) => (
                <div
                  key={lesson._id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Lesson {lesson.order}: {lesson.title}
                      </h3>
                      {lesson.description && (
                        <p className="text-gray-600 text-sm mt-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                    {(user?.role === "teacher" || user?.role === "admin") &&
                      lesson.createdBy?._id === user?._id && (
                        <Link
                          to={`/teacher/courses/${id}/lessons/edit/${lesson._id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </Link>
                      )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* MATERIALS */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Course Materials</h2>
          {(user?.role === "teacher" || user?.role === "admin") && (
            <Link
              to={`/teacher/courses/${id}/materials/upload`}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Upload Material
            </Link>
          )}
        </div>

        {materials.length === 0 ? (
          <p className="text-gray-500 italic">No materials uploaded yet.</p>
        ) : (
          <div className="space-y-3">
            {materials.map((material) => (
              <div
                key={material._id}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {material.title}
                    </h3>
                    {material.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {material.description}
                      </p>
                    )}
                  </div>
                  <a
                    href={material.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseDetails;
