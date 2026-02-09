import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";
import LessonViewer from "./LessonViewer";
import Layout from "../../layout/Layout";

const StudentCourseDetails = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          {course.teacherName} • Grade {course.grade} • Section {course.section}
        </p>
      </div>

      {/* Lesson Viewer */}
      {lessons.length ? (
        <LessonViewer
          lessons={lessons}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      ) : (
        <p className="text-gray-500">No lessons available yet.</p>
      )}
    </div>
    </Layout>
  );
};

export default StudentCourseDetails;
