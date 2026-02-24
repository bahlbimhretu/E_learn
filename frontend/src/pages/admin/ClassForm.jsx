import { useState, useEffect } from "react";
import api from "../../api/axios";

const ClassForm = ({ teachers, classData, onClose, onSaved }) => {
  const [form, setForm] = useState({
    grade: "",
    section: "",
    academicYear: "",
    homeRoomTeacher: "",
  });

  useEffect(() => {
    if (classData) {
      setForm({
        grade: classData.grade,
        section: classData.section,
        academicYear: classData.academicYear,
        homeRoomTeacher: classData.homeRoomTeacher?._id || "",
      });
    }
  }, [classData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (classData) {
        await api.put(`/classrooms/${classData._id}`, form);
      } else {
        await api.post("/classrooms", form);
      }

      onSaved();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <h2 className="text-xl font-bold mb-4">
          {classData ? "Edit Class" : "Create Class"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="grade"
            placeholder="Grade"
            value={form.grade}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="section"
            placeholder="Section"
            value={form.section}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            name="academicYear"
            placeholder="Academic Year"
            value={form.academicYear}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="homeRoomTeacher"
            value={form.homeRoomTeacher}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">Assign Home Room Teacher</option>
            {teachers.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="flex justify-end space-x-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;