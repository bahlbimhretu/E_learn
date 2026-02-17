import { useEffect, useState } from "react";
import api from "../api/axios"; // your axios instance

const HomeRoomAssignment = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, teachersRes] = await Promise.all([
          api.get("/classes"),
          api.get("/users?role=teacher")
        ]);
        setClasses(classesRes.data);
        setTeachers(teachersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const assignTeacher = async (classId, teacherId) => {
    try {
      await api.post(`/classes/${classId}/assign-homeroom`, { teacherId });
      setClasses((prev) =>
        prev.map((c) =>
          c._id === classId ? { ...c, homeroomTeacher: teacherId } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const revokeTeacher = async (classId) => {
    try {
      await api.post(`/classes/${classId}/revoke-homeroom`);
      setClasses((prev) =>
        prev.map((c) =>
          c._id === classId ? { ...c, homeroomTeacher: null } : c
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Home Room Assignment</h1>
      <table className="w-full table-auto border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Class</th>
            <th className="p-2 border">Current Home Room Teacher</th>
            <th className="p-2 border">Assign / Revoke</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr key={cls._id}>
              <td className="p-2 border">{cls.name}</td>
              <td className="p-2 border">
                {cls.homeroomTeacher
                  ? teachers.find((t) => t._id === cls.homeroomTeacher)?.name
                  : "None"}
              </td>
              <td className="p-2 border space-x-2">
                <select
                  value={cls.homeroomTeacher || ""}
                  onChange={(e) => assignTeacher(cls._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {cls.homeroomTeacher && (
                  <button
                    onClick={() => revokeTeacher(cls._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeRoomAssignment;
