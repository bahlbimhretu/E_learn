import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Link } from "react-router-dom";
import {
  BookOpen,
  FileText,
  X,
  Eye,
  Users,
  ClipboardCheck,
  BarChart3,
  Home,
  MessageCircle
} from "lucide-react";
import Tooltip from "../../components/Tooltip";

const TeacherDashboard = () => {
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDesc, setShowDesc] = useState(false);
  const [activeCourse, setActiveCourse] = useState(null);

  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const load = async () => {
      try {
        const statsRes = await api.get("/dashboard/teacher");
        setStats(statsRes.data);

        const coursesRes = await api.get(
          "/courses/teacher/course-instances"
        );
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
        <p>Loading dashboard...</p>
      </Layout>
    );
  }

  const homeroom = stats?.homeroom;

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
      {/* ===================== TABS ===================== */}
      <div className="flex gap-6 mb-8 border-b">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 pb-2 px-2 transition ${
            activeTab === "home"
              ? "border-b-2 border-blue-600 text-blue-600 font-semibold"
              : "text-gray-500 hover:text-blue-600"
          }`}
        >
          <Home size={20} />
          Home
        </button>

        {homeroom?.isHomeroom && (
          <button
            onClick={() => setActiveTab("homeroom")}
            className={`flex items-center gap-2 pb-2 px-2 transition ${
              activeTab === "homeroom"
                ? "border-b-2 border-yellow-600 text-yellow-600 font-semibold"
                : "text-gray-500 hover:text-yellow-600"
            }`}
          >
            <Users size={20} />
            Homeroom
          </button>
        )}
      </div>

      {/* ===================== HOME TAB ===================== */}
      {activeTab === "home" && (
        <>
          {/* GENERAL STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card
              label="My Classes"
              value={stats?.classesCount}
              color="bg-blue-600"
            />
            <Card
              label="Lessons Uploaded"
              value={stats?.lessonsCount}
              color="bg-green-600"
            />
            <Card
              label="Active Students"
              value={stats?.activeStudents}
              color="bg-purple-600"
            />
          </div>

          {/* SUBJECT CLASSES */}
          <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-xl shadow-lg border border-white/30">
            <h2 className="text-xl font-bold mb-6">
              My Assigned Classes
            </h2>

            {courses.length === 0 ? (
              <p>No classes assigned yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="rounded-2xl bg-white/60 backdrop-blur-xl border shadow-lg flex flex-col overflow-hidden"
                  >
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
                        {course.courseTemplate?.description ||
                          "No description"}
                      </p>

                      <p className="text-xs text-gray-600 mt-auto">
                        {course.students?.length || 0} students
                      </p>
                    </div>

                    <div className="flex justify-around px-4 py-3 border-t bg-white/50">
                      <Tooltip text="Description">
                        <button onClick={() => openDescription(course)}>
                          <FileText />
                        </button>
                      </Tooltip>

                      <Tooltip text="View Class">
                        <Link
                          to={`/teacher/course-instances/${course._id}`}
                        >
                          <Eye />
                        </Link>
                      </Tooltip>

                      <Tooltip text="Lessons">
                        <Link
                          to={`/teacher/courses/${course._id}/lessons`}
                        >
                          <BookOpen />
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ===================== HOMEROOM TAB ===================== */}
     {activeTab === "homeroom" && homeroom?.isHomeroom && (
  <div className="p-6 rounded-2xl bg-yellow-50 border border-yellow-200 shadow-lg">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold">
        Homeroom – Grade {homeroom.classInfo?.grade}{" "}
        {homeroom.classInfo?.section}
      </h2>

      <span className="text-sm text-gray-600">
        {homeroom.classInfo?.academicYear}
      </span>
    </div>

    {/* ===== STAT CARDS ===== */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card
        label="Students"
        value={homeroom.classInfo?.studentsCount}
        color="bg-yellow-600"
      />

      <Card
        label="Attendance Rate"
        value={
          homeroom.attendanceRate
            ? `${homeroom.attendanceRate}%`
            : "0%"
        }
        color="bg-orange-600"
      />

      <Card
        label="At Risk"
        value={homeroom.lowPerformers}
        color="bg-red-600"
      />

      <Card
        label="Today Status"
        value={
          homeroom.todayAttendanceTaken ? "Recorded" : "Pending"
        }
        color={
          homeroom.todayAttendanceTaken
            ? "bg-green-600"
            : "bg-gray-600"
        }
      />
    </div>

    {/* ===== TODAY SUMMARY ===== */}
    {homeroom.todayAttendanceTaken && (
      <div className="mb-6 p-4 bg-white rounded-lg shadow border">
        <h3 className="font-semibold mb-2">Today's Summary</h3>
        <div className="flex gap-6 text-sm">
          <span className="text-green-600 font-medium">
            Present: {homeroom.todayPresentCount}
          </span>
          <span className="text-red-600 font-medium">
            Absent: {homeroom.todayAbsentCount}
          </span>
        </div>
      </div>
    )}

    {/* ===== ACTIONS ===== */}
    <div className="flex flex-wrap gap-4">
      <ActionButton
        to="/teacher/homeroom"
        icon={<Users size={18} />}
        label="Homeroom Overview"
      />

      {!homeroom.todayAttendanceTaken ? (
  <ActionButton
    to={`/teacher/homeroom/attendance/${homeroom.classInfo?._id}`}
    icon={<ClipboardCheck size={18} />}
    label="Take Today's Attendance"
  />
) : (
  <ActionButton
    to={`/teacher/homeroom/attendance/${homeroom.classInfo?._id}`}
    icon={<Eye size={18} />}
    label="View / Edit Attendance"
  />
)}

      <ActionButton
        to="/teacher/homeroom/performance"
        icon={<BarChart3 size={18} />}
        label="View Performance"
      />
      <ActionButton
  to={`/teacher/homeroom/messages/${homeroom.classInfo?._id}`}
  icon={<MessageCircle size={18} />}
  label="Message Parents"
/>
    </div>
  </div>
)}

      {/* ===================== DESCRIPTION MODAL ===================== */}
      {showDesc && activeCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold">
                {activeCourse.courseTemplate?.name}
              </h2>
              <button onClick={closeDescription}>
                <X />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <p className="whitespace-pre-line">
                {activeCourse.courseTemplate?.description ||
                  "No description"}
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
    <h2 className="text-lg font-semibold">{label}</h2>
    <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
  </div>
);

const ActionButton = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
  >
    {icon}
    {label}
  </Link>
);

export default TeacherDashboard;