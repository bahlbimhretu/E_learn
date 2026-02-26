import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import {
  Users,
  UserCheck,
  GraduationCap,
  BookOpen,
  Layers,
  FileText,
  AlertCircle,
} from "lucide-react";

/* ================= REUSABLE STAT CARD ================= */
const StatCard = ({ title, value, icon: Icon, iconColor }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex justify-between items-center hover:shadow-md transition">
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>

    <div className="p-3 rounded-xl bg-gray-50">
      <Icon className={`w-7 h-7 ${iconColor}`} />
    </div>
  </div>
);

/* ================= DASHBOARD ================= */
const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Admin Stats Error:", err);
      }
    };

    fetchStats();
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <div className="p-6">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen space-y-8">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            System statistics overview
          </p>
        </div>

        {/* ================= USER OVERVIEW ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-4">User Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Users"
              value={stats.users.total}
              icon={Users}
              iconColor="text-blue-600"
            />

            <StatCard
              title="Students"
              value={stats.users.students}
              icon={GraduationCap}
              iconColor="text-indigo-600"
            />

            <StatCard
              title="Teachers"
              value={stats.users.teachers}
              icon={UserCheck}
              iconColor="text-green-600"
            />
          </div>
        </div>

        {/* ================= ACADEMIC OVERVIEW ================= */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Academic Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Total Courses"
              value={stats.courses.total}
              icon={BookOpen}
              iconColor="text-purple-600"
            />

            <StatCard
              title="Total Lessons"
              value={stats.courses.totalLessons}
              icon={Layers}
              iconColor="text-orange-600"
            />

            <StatCard
              title="Total Materials"
              value={stats.courses.totalMaterials}
              icon={FileText}
              iconColor="text-pink-600"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;