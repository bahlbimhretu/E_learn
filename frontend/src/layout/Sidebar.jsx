import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  HelpCircle,
  Users,
  Upload,
  Bell,
  Settings,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const menu = {
    teacher: [
      { label: "Dashboard", link: "/teacher", icon: LayoutDashboard },
      { label: "My Courses", link: "/teacher/course-instances", icon: BookOpen },
      { label: "Course Materials", link: "/teacher/materials", icon: FileText },
      { label: "Assignments", link: "/teacher/assignments", icon: ClipboardList },
      { label: "Quizzes", link: "/teacher/quizzes", icon: HelpCircle },
      { label: "Attendance", link: "/teacher/attendance", icon: Users },
      { label: "Result & Grading", link: "/teacher/grading", icon: Upload },
      { label: "Announcements", link: "/teacher/announcements", icon: Bell },
      { label: "Settings", link: "/settings", icon: Settings },
    ],

    student: [
      { label: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
      { label: "My Courses", link: "/my-courses", icon: BookOpen },
      { label: "Course Materials", link: "/my-materials", icon: FileText },
      { label: "Assignments", link: "/my-assignments", icon: ClipboardList },
      { label: "Quizzes", link: "/my-quizzes", icon: HelpCircle },
      { label: "Grades & Feedback", link: "/my-grades", icon: Upload },
      { label: "Attendance", link: "/my-attendance", icon: Users },
      { label: "Announcements", link: "/student/announcements", icon: Bell },
      { label: "Profile / Settings", link: "/profile", icon: Settings },
    ],

    admin: [
      { label: "Dashboard", link: "/admin", icon: LayoutDashboard },
      { label: "Users", link: "/admin/users", icon: Users },
    ],
  };

  const items = menu[user?.role] || [];
  const isStudent = user?.role === "student";

  return (
    <aside
      className={`h-screen w-64 sticky top-0
        ${
          isStudent
            ? "bg-slate-50 border-r border-slate-200 text-slate-600"
            : "bg-gradient-to-b from-[#0f172a] to-[#020617] text-gray-300"
        }`}
    >
      {/* Header */}
      <div
        className={`px-6 py-5 border-b
          ${
            isStudent
              ? "border-slate-200"
              : "border-white/10"
          }`}
      >
        <h1
          className={`font-bold text-lg
            ${
              isStudent ? "text-blue-600" : "text-white"
            }`}
        >
          Tsinseta LMS
        </h1>

        <p className="text-sm capitalize text-gray-500">
          {isStudent ? "LMS Portal" : user?.role || "Portal"}
        </p>
      </div>

      {/* Menu */}
      <nav className="px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.link}
              to={item.link}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
                ${
                  isStudent
                    ? isActive
                      ? "bg-blue-100 text-blue-600 font-medium"
                      : "hover:bg-slate-100"
                    : isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
