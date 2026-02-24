import { useEffect, useState } from "react";
import api from "../../api/axios"; 
import Layout from "../../layout/Layout";
import { Link } from "react-router-dom";
import { BookOpen, FileText, X, Eye } from "lucide-react";
import Tooltip from "../../components/Tooltip";

const MyCourseInstances = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDesc, setShowDesc] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        // Exact endpoint used in TeacherDashboard.jsx
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

  const openDescription = (course) => {
    setActiveCourse(course);
    setShowDesc(true);
  };

  const closeDescription = () => {
    setActiveCourse(null);
    setShowDesc(false);
  };

  if (loading) return <Layout><p className="p-6">Loading...</p></Layout>;

  return (
    <Layout>
      <div className="p-6 rounded-xl bg-white/20 backdrop-blur-xl shadow-lg border border-white/30">
        <h1 className="text-3xl font-bold mb-6">My Assigned Classes</h1>

        {courses.length === 0 ? (
          <p>No classes assigned yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="rounded-2xl bg-white/60 backdrop-blur-xl border shadow-lg flex flex-col overflow-hidden transition hover:shadow-2xl"
              >
                {/* THUMBNAIL - Now directs to /courses/ to match Dashboard */}
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
                </div>

                {/* ACTION BAR */}
                <div className="flex justify-around px-4 py-3 border-t bg-white/50">
                  <Tooltip text="Description">
                    <button onClick={() => openDescription(course)}>
                      <FileText />
                    </button>
                  </Tooltip>

                  <Tooltip text="View Class">
                    {/* Updated to /courses/ to match Dashboard logic */}
                    <Link to={`/courses/${course._id}`}>
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
                {activeCourse.courseTemplate?.name}
              </h2>
              <button onClick={closeDescription}><X /></button>
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

export default MyCourseInstances;