import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "../../layout/AdminLayout";
import { Users, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        console.error("Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const Card = ({ title, value, icon: Icon, onClick }) => (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="text-3xl font-bold mt-1">{value}</h2>
        </div>
        <Icon className="w-10 h-10 text-blue-600" />
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">
            School overview and statistics
          </p>
        </div>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* TOP STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card
                title="Total Students"
                value={stats.students}
                icon={Users}
                onClick={() => navigate("/admin/users/students")}
              />

              <Card
                title="Teachers"
                value={stats.teachers}
                icon={GraduationCap}
                onClick={() => navigate("/admin/teachers")}
              />
            </div>

            {/* QUICK ACTIONS */}
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/admin/register")}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  ➕ Add User
                </button>

                <button className="border px-4 py-2 rounded-lg hover:bg-gray-50">
                  📄 Generate Report
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default UserManagement;
