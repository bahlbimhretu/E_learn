import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import api from "../../../api/axios";
import { Plus } from "lucide-react";
import CourseSwitcher from "../CourseSwitcher";
import CourseInstanceCard from "./CourseInstanceCard";

const CourseInstanceList = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstances();
  }, []);

  const fetchInstances = async () => {
    try {
      const { data } = await api.get("/admin/course-instances");
      setInstances(data);
    } catch (err) {
      console.error("FETCH INSTANCES ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    await api.patch(`/admin/course-instances/${id}/archive`);
    fetchInstances();
  };

 
const handleRestore = async (id) => {
  try {
    await api.patch(`/admin/course-instances/${id}/restore`);
    // refresh list
    fetchInstances();
  } catch (err) {
    console.error("Restore instance error:", err);
  }
};

  return (
    <AdminLayout>
      <CourseSwitcher />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Course Instances</h1>
            <p className="text-sm text-gray-500">
              Active course offerings per class and academic year
            </p>
          </div>

          <Link
            to="/admin/course-instances/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus size={16} /> New Course Instance
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center">Loading course instances...</div>
        ) : instances.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No course instances found
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {instances.map((instance) => (
    <CourseInstanceCard
      key={instance._id}
      instance={instance}
      onArchive={handleArchive}
      onRestore={handleRestore}
    />
  ))}
</div>

        )}
      </div>
    </AdminLayout>
  );
};

export default CourseInstanceList;
