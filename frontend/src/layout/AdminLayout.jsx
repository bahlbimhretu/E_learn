import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  LayoutDashboard,
  Users,
  BookOpen,
  BarChart3,
  Megaphone,
  Bell,
  School,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminLayout = ({ children, stats }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // 🔒 Prevent background scroll when sidebar open (mobile)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItem = (to, label, Icon, end = false) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition text-sm
        ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 transform
        bg-gradient-to-b from-[#0f172a] to-[#020617] text-gray-300
        transition-transform duration-300 overflow-y-auto
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex`}
      >
        <div className="flex flex-col w-full">

          <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
            <div>
              <h1 className="text-white font-bold text-lg">Tsinseta LMS</h1>
              <p className="text-sm text-gray-400">Admin Portal</p>
            </div>

            <button onClick={() => setOpen(false)} className="md:hidden">
              <X />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {navItem("/admin", "Dashboard", LayoutDashboard, true)}
            {navItem("/admin/users", "User Management", Users)}
            {navItem("/admin/courses", "Course Management", BookOpen)}
            {navItem("/admin/classes", "Class Management", School)}
            {navItem("/admin/reports", "Reports", BarChart3)}
            {navItem("/admin/promoteclass", "Promote Class", School)}
            {navItem("/admin/announcements", "Announcements", Megaphone)}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <header className="bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">

          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="md:hidden">
              <Menu size={22} />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-sm sm:text-base text-gray-800">
                  {user?.name || "Administrator"}
                </h2>

                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full text-white bg-red-500">
                  ADMIN
                </span>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-500">
                System Administrator Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">

            <div className="relative cursor-pointer">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />

              {stats?.announcements?.active > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                  {stats.announcements.active}
                </span>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-red-600 transition"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;