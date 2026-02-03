import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const LibraryDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/dashboard/library");
        setStats(res.data);
      } catch (err) {
        console.error("Library dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Layout><p>Loading dashboard...</p></Layout>;
  if (!stats) return <Layout><p>No data available.</p></Layout>;

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Library Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <Card label="Total Materials" value={stats.totalMaterials} color="bg-blue-500" />
        <Card label="Uploaded This Week" value={stats.uploadedThisWeek} color="bg-green-500" />
        <Card label="Uploaded By You" value={stats.uploadedByMe} color="bg-purple-500" />
      </div>

      <div className="bg-white p-6 mt-10 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Library Notes</h2>
        <p className="text-gray-600">
          You can upload PDFs, videos, slides, and notes under the “Upload” menu.
        </p>
      </div>
    </Layout>
  );
};

const Card = ({ label, value, color }) => (
  <div className={`p-6 rounded-xl text-white shadow-md ${color}`}>
    <h2 className="text-lg font-semibold">{label}</h2>
    <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
  </div>
);

export default LibraryDashboard;
