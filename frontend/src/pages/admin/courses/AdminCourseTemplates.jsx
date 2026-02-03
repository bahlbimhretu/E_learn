import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import api from "../../../api/axios";
import { Plus, Pencil, Archive } from "lucide-react";

const AdminCourseTemplates = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

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
    const confirmed = window.confirm(
      "Are you sure you want to archive this course template?"
    );
    if (!confirmed) return;

    try {
      await api.patch(`/admin/course-templates/${id}/archive`);
      setCourses((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, archived: true } : c
        )
      );
    } catch (err) {
      console.error("ARCHIVE ERROR", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Course Templates</h1>
            <p className="text-sm text-gray-500">
              Manage reusable academic course definitions
            </p>
          </div>

          <Link
            to="/admin/courses/new"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            <Plus size={16} />
            New Course
          </Link>
        </div>

        {/* TABLE */}
        <div className="bg-white border rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No course templates found
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Title</th>
                  <th className="text-left px-4 py-3">Code</th>
                  <th className="text-left px-4 py-3">Grade</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-right px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course._id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {course.title}
                    </td>
                    <td className="px-4 py-3">{course.code}</td>
                    <td className="px-4 py-3">
                      Grade {course.grade}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      {course.category}
                    </td>
                    <td className="px-4 py-3">
                      {course.archived ? (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                          Archived
                        </span>
                      ) : (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">

                      {/* EDIT */}
                      <Link
                        to={`/admin/courses/${course._id}/edit`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>

                      {/* ARCHIVE */}
                      {!course.archived && (
                        <button
                          onClick={() => handleArchive(course._id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:underline ml-3"
                        >
                          <Archive size={14} />
                          Archive
                        </button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCourseTemplates;
