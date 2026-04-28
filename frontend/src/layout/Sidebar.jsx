import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  Users,
  Bell,
  MessageCircle,
  X,
} from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const { user } = useContext(AuthContext);

  const menu = {
    teacher: [
      { label: "Dashboard", link: "/teacher", icon: LayoutDashboard },
      { label: "My Courses", link: "/teacher/course-instances", icon: BookOpen },
      { label: "Announcements", link: "/teacher/announcements", icon: Bell },
    ],
    parent: [
      { label: "Dashboard", link: "/parent", icon: LayoutDashboard },
      { label: "Performance", link: "/parent/results", icon: ClipboardList },
      { label: "Attendance", link: "/parent/attendance", icon: Users },
      { label: "Announcements", link: "/parent/announcements", icon: Bell },
      { label: "Inbox", link: "/parent/inbox", icon: MessageCircle },
    ],
    student: [
      { label: "Dashboard", link: "/dashboard", icon: LayoutDashboard },
      { label: "My Courses", link: "/my-courses", icon: BookOpen },
      { label: "Attendance", link: "/student/attendance", icon: Users },
      { label: "Announcements", link: "/student/announcements", icon: Bell },
      { label: "Results", link: "/student/results", icon: ClipboardList },
    ],
  };

  const items = menu[user?.role] || [];

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-64 transform bg-[#020617] text-gray-300
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >
        <div className="flex flex-col w-full">
          
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
            <h1 className="text-white font-bold">Tsinseta LMS</h1>

            {/* Close button (mobile) */}
            <button onClick={() => setOpen(false)} className="md:hidden">
              <X />
            </button>
          </div>

          {/* Menu */}
          <nav className="px-3 py-4 space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.link}
                  to={item.link}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition
                    ${
                      isActive
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
        </div>
      </aside>
    </>
  );
};

export default Sidebar;