import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  X,
  Eye,
} from "lucide-react";
import Tooltip from "../../components/Tooltip";

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDesc, setShowDesc] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const statsRes = await api.get("/dashboard/teacher");
        setStats(statsRes.data);

        const coursesRes = await api.get("/courses/teacher/course-instances");
        setCourses(coursesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeDescription();
    
    if (showDesc) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [showDesc]);

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  const openDescription = (course) => {
    setActiveCourse(course);
    setShowDesc(true);
  };

  const closeDescription = () => {
    setActiveCourse(null);
    setShowDesc(false);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card label="My Classes" value={stats?.classesCount} color="bg-blue-600" />
        <Card label="Lessons Uploaded" value={stats?.lessonsCount} color="bg-green-600" />
        <Card label="Active Students" value={stats?.activeStudents} color="bg-purple-600" />
      </div>

      {/* CLASSES */}
      <div className="p-6 rounded-xl bg-white/20 backdrop-blur-xl shadow-lg border border-white/30">
        <h2 className="text-xl font-bold mb-6">My Assigned Classes</h2>

        {courses.length === 0 ? (
          <p>No classes assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="rounded-2xl bg-white/60 backdrop-blur-xl border shadow-lg flex flex-col overflow-hidden"
              >
                {/* THUMBNAIL */}
                <Link to={`/courses/${course._id}`}>
                  <div className="relative h-40 group">
                    {course.courseTemplate?.thumbnail ? (
                      
                      <img
  src={`http://localhost:5000${course.courseTemplate.thumbnail}`}
  alt="thumbnail"
  className="w-full h-full object-cover group-hover:scale-110 transition"
/>


                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Eye />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </Link>

                {/* CONTENT */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-semibold">
                    {course.courseTemplate?.name}


                  </h3>

                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {course.courseTemplate?.category || "General"}

                    </span>
                    <span className="px-2 py-1 bg-blue-100 rounded">
                      Grade {course.grade} – {course.section}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 rounded">
                      {course.academicYear}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {course.courseTemplate?.description || "No description"}
                  </p>

                  <p className="text-xs text-gray-600 mt-auto">
                    {course.students?.length || 0} students
                  </p>
                </div>

                {/* ACTION BAR (TEACHER SAFE) */}
                <div className="flex justify-around px-4 py-3 border-t bg-white/50">
                  <Tooltip text="Description">
                    <button onClick={() => openDescription(course)}>
                      <FileText />
                    </button>
                  </Tooltip>

                  <Tooltip text="View Class">
                    <Link to={`/teacher/course-instances/${course._id}`}>
  <Eye />
</Link>

                  </Tooltip>

                  <Tooltip text="Lessons">
                    <Link to={`/teacher/courses/${course._id}/lessons`}>
                      <BookOpen />
                    </Link>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DESCRIPTION MODAL */}
      {showDesc && activeCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">
                {activeCourse.courseTemplate?.title}
              </h2>
              <button onClick={closeDescription}>
                <X />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="whitespace-pre-line">
                {activeCourse.courseTemplate?.description || "No description"}
              </p>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

const Card = ({ label, value, color }) => (
  <div className={`p-6 rounded-xl text-white shadow-md ${color}`}>
    <h2 className="text-xl font-semibold">{label}</h2>
    <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
  </div>
);

export default TeacherDashboard;
