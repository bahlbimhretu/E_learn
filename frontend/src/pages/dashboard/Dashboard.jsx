import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/dashboard/student");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Layout><p>Loading dashboard...</p></Layout>;
  if (!stats) return <Layout><p>No data</p></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card label="Total Courses" value={stats.totalCourses} color="bg-blue-500" />
        <Card label="Enrolled" value={stats.enrolled} color="bg-green-500" />
        <Card label="Materials" value={stats.materials} color="bg-purple-500" />
        <Card label="Lessons" value={stats.lessons} color="bg-red-500" />
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Recent Courses</h2>
        <ul className="space-y-3">
          {stats.recentCourses?.length ? (
            stats.recentCourses.map((c) => (
              <li key={c._id} className="p-4 bg-gray-50 rounded border">
                {c.title}
              </li>
            ))
          ) : (
            <li>No recent courses</li>
          )}
        </ul>
      </div>
    </Layout>
  );
};

const Card = ({ label, value, color }) => (
  <div className={`p-6 rounded-xl text-white shadow-md ${color}`}>
    <h2 className="text-xl font-semibold">{label}</h2>
    <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
  </div>
);

export default Dashboard;
