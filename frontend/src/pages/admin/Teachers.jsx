import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../api/axios";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await api.get("/admin/teachers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setTeachers(res.data);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-sm text-gray-500">List of all teachers</p>
        </div>

        {/* CONTENT */}
        <div className="bg-white rounded-2xl border overflow-x-auto">
          {loading ? (
            <p className="p-4">Loading teachers...</p>
          ) : teachers.length === 0 ? (
            <p className="p-4 text-gray-500">No teachers found</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Specialization</th>
                  <th className="text-left px-4 py-3">Education Level</th>
                  <th className="text-left px-4 py-3">Assigned Courses</th>
                  <th className="text-left px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher._id} className="border-b last:border-b-0">
                    <td className="px-4 py-3 font-medium">
                     {teacher.name}

                    </td>

                    <td className="px-4 py-3">
                      {teacher.teacherProfile?.specialization || "—"}

                    </td>

                    <td className="px-4 py-3">
                      {teacher.teacherProfile?.educationLevel || "—"}
                    </td>

                    <td className="px-4 py-3">
  {teacher.assignedCourses?.length > 0 ? (
    <ul className="space-y-1">
      {teacher.assignedCourses.map((c, idx) => (
        <li key={idx} className="text-xs">
          {c.title} {c.grade} ({c.section})
        </li>
      ))}
    </ul>
  ) : (
    <span className="text-gray-400">Not assigned</span>
  )}
</td>


                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${
                            teacher.status === "active"
                              ? "bg-green-100 text-green-700"
                              : teacher.status === "suspended"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        {teacher.status}
                      </span>
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

export default Teachers;
