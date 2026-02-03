import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import AdminLayout from "../../layout/AdminLayout";
import {
  Users,
  BookOpen,
  Layers,
  AlertCircle,
} from "lucide-react";

const OverviewCard = ({ title, value, subtitle, icon: Icon, iconColor }) => (
  <div className="bg-white border rounded-xl p-5 flex justify-between">
    <div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
    <Icon className={`w-6 h-6 ${iconColor}`} />
  </div>
);

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
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
        console.log("Admin Stats Error:", err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) {
    return (
      <AdminLayout>
        <div>Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* SYSTEM OVERVIEW */}
        <section className="space-y-6">

          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold">System Overview</h1>
            <p className="text-gray-500 text-sm">
              Comprehensive view of your LMS system
            </p>
          </div>

          {/* TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <OverviewCard
              title="Total Users"
              value={stats.users.total}
              subtitle={`Students: ${stats.users.students} • Teachers: ${stats.users.teachers}`}
              icon={Users}
              iconColor="text-blue-600"
            />

            <OverviewCard
              title="Active Courses"
              value={stats.courses.total}
              subtitle="Currently running"
              icon={BookOpen}
              iconColor="text-green-600"
            />
            
            <OverviewCard
              title="Active Classes"
              value={stats.enrollments}
              subtitle="This academic year"
              icon={Layers}
              iconColor="text-purple-600"
            />

            <OverviewCard
              title="Pending Actions"
              value={stats.pending || 0}
              subtitle="Require attention"
              icon={AlertCircle}
              iconColor="text-red-600"
            />
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* STUDENTS */}
            <div className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Students</h3>
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-2xl font-bold">{stats.users.students}</p>
              <p className="text-sm text-gray-500 mt-2">
                Grade 9 • Grade 10 • Grade 11 • Grade 12
              </p>
            </div>

            {/* TEACHERS */}
            <div className="bg-white border rounded-xl p-5">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold">Teachers</h3>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-2xl font-bold">{stats.users.teachers}</p>
              <p className="text-sm text-gray-500 mt-2">
                Full-time & Part-time
              </p>
            </div>

            {/* SYSTEM ACTIVITY */}
            <div className="bg-white border rounded-xl p-5">
              <h3 className="font-semibold mb-3">System Activity</h3>
              <p className="text-sm text-gray-600">
                Today’s Logins
              </p>
              <p className="text-xl font-bold">287 users</p>
            </div>
          </div>

          {/* RECENT SYSTEM ACTIVITY */}
          

        </section>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
