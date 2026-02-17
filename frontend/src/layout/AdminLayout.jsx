import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // adjust path if needed
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  ShieldCheck,
  BarChart3,
  Megaphone,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gradient-to-b from-[#0f172a] to-[#020617] text-gray-300 sticky top-0 h-screen">

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10">
          <h1 className="text-white font-bold text-lg">Tsinseta LMS</h1>
          <p className="text-sm text-gray-400">Admin Portal</p>
          <p className="text-xs text-gray-500 mt-1">System Management</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-1 text-sm">

          <NavLink to="/admin" end className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
          }>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/users" className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
          }>
            <Users size={18} />
            User Management
          </NavLink>

          <NavLink to="/admin/courses" className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
          }>
            <BookOpen size={18} />
            Course Management
          </NavLink>
            <NavLink
              to="/admin/homeroom"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
              }
            >
              <Users size={18} />
              Home Room Assignment
            </NavLink>


          <NavLink to="/admin/reports" className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
          }>
            <BarChart3 size={18} />
            Reports
          </NavLink>

          <NavLink to="/admin/announcements" className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
          }>
            <Megaphone size={18} />
            Announcements
          </NavLink>

          <NavLink to="/admin/settings" className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg transition
            ${isActive ? "bg-blue-600 text-white" : "hover:bg-white/10"}`
          }>
            <Settings size={18} />
            System Settings
          </NavLink>

        </nav>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP NAVBAR */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10">

          {/* Left */}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-gray-800">
                Ftsum Administrator
              </h2>
              <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                System Admin
              </span>
            </div>
            <p className="text-xs text-gray-500">
              System Administrator Access
            </p>
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">

            {/* Notifications */}
            <div className="relative cursor-pointer">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                8
              </span>
            </div>

            {/* Logout */}
           <button
  onClick={logout}
  className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition"
>
  <LogOut size={16} />
  Logout
</button>

          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6">
          {children}
        </main>

      </div>

    </div>
  );
};

export default AdminLayout;
