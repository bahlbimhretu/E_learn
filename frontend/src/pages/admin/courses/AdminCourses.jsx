import { useEffect, useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import api from "../../../api/axios";
import { Link } from "react-router-dom";
import { Plus, Pencil, Archive, RotateCcw } from "lucide-react";
import CourseSwitcher from "../CourseSwitcher";
import CourseCard from "./admincourseTcard";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // ** NEW STATE VARIABLES **
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [confirmAction, setConfirmAction] = useState(null); // {type: 'archive'|'restore', id}

  useEffect(() => {
    fetchCourses();
  }, []);

  // ** Filtered courses based on search + filters **
  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus ? c.status === filterStatus : true;
    const matchesCategory = filterCategory ? c.category === filterCategory : true;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/admin/course-templates");
      setCourses(data);
    } catch (err) {
      console.error("FETCH COURSES ERROR", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this course template?")) return;

    try {
      await api.patch(`/admin/course-templates/${id}/archive`);
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "archived" } : c))
      );
    } catch (err) {
      console.error("ARCHIVE ERROR", err);
    }
  };

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this course template?")) return;

    try {
      await api.patch(`/admin/course-templates/${id}/restore`);
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: "active" } : c))
      );
    } catch (err) {
      console.error("RESTORE ERROR", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <div className="flex justify-between items-center mb-6">
  
  <CourseSwitcher />
</div>

            <h1 className="text-2xl font-bold">Course Templates</h1>
            <p className="text-sm text-gray-500">
              Manage reusable academic course definitions
            </p>
          </div>

          <Link
            to="/admin/course-templates/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus size={16} />
            New Course Template
          </Link>
        </div>

        {/* SEARCH + FILTERS */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search courses..."
            className="border px-3 py-2 rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="border px-3 py-2 rounded"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>

          <select
            className="border px-3 py-2 rounded"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Science">Science</option>
            <option value="Math">Math</option>
            <option value="Arts">Arts</option>
            {/* add more categories if needed */}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Loading courses...</div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No course templates found
            </div>
          ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
  {filteredCourses.map((course) => (
    <CourseCard
      key={course._id}
      course={course}
      onArchive={(id) =>
        setConfirmAction({ type: "archive", id })
      }
      onRestore={(id) =>
        setConfirmAction({ type: "restore", id })
      }
    />
  ))}
</div>

          )}
        </div>

        {/* MODAL */}
        {confirmAction && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-96">
              <h2 className="text-lg font-bold mb-4">
                {confirmAction.type === "archive"
                  ? "Archive Course Template"
                  : "Restore Course Template"}
              </h2>
              <p className="text-gray-600 mb-6">
                {confirmAction.type === "archive"
                  ? "Are you sure you want to archive this course? It will be hidden from active use."
                  : "Are you sure you want to restore this course? It will become active again."}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmAction.type === "archive"
                      ? handleArchive(confirmAction.id)
                      : handleRestore(confirmAction.id);
                    setConfirmAction(null);
                  }}
                  className={`px-4 py-2 rounded text-white ${
                    confirmAction.type === "archive" ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCourses;
