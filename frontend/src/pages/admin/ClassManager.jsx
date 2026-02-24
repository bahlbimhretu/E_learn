import { useEffect, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import api from "../../api/axios";
import ClassForm from "./ClassForm";

const ClassManager = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const fetchData = async () => {
    try {
      const classRes = await api.get("/classrooms");
      const teacherRes = await api.get("/users?role=teacher");

      setClasses(classRes.data);
      setTeachers(teacherRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (cls) => {
    setSelectedClass(cls);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedClass(null);
    setShowForm(true);
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this class?")) return;

    try {
      await api.put(`/classrooms/${id}/archive`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-bold">Class Management</h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Create Class
          </button>
        </div>

        {/* Class Table */}
        <div className="bg-white shadow rounded">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Grade</th>
                <th className="p-3 text-left">Section</th>
                <th className="p-3 text-left">Academic Year</th>
                <th className="p-3 text-left">Home Room Teacher</th>
                <th className="p-3 text-left">Students</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {classes.map((cls) => (
                <tr key={cls._id} className="border-t">
                  <td className="p-3">{cls.grade}</td>
                  <td className="p-3">{cls.section}</td>
                  <td className="p-3">{cls.academicYear}</td>
                  <td className="p-3">
                    {cls.homeRoomTeacher
                      ? cls.homeRoomTeacher.name
                      : "Not assigned"}
                  </td>
                  <td className="p-3">{cls.studentCount || 0}</td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEdit(cls)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleArchive(cls._id)}
                      className="text-red-600"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}

              {classes.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No classes created yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        {showForm && (
          <ClassForm
            teachers={teachers}
            classData={selectedClass}
            onClose={() => setShowForm(false)}
            onSaved={() => {
              setShowForm(false);
              fetchData();
            }}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ClassManager;