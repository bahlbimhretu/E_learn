import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import api from "../../../api/axios";

const CourseInstanceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState({
    courseTemplateId: "",
    academicYear: "2024/2025",
    grade: "",
    section: "",
    teacherId: "",
  });

  /* ---------------- FETCH DROPDOWNS ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [templatesRes, teachersRes] = await Promise.all([
          api.get("/admin/course-templates"),
          api.get("/admin/teachers"),
        ]);

        setTemplates(
          templatesRes.data.filter((t) => t.status !== "archived")
        );
        setTeachers(teachersRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  /* ---------------- EDIT MODE ---------------- */
  useEffect(() => {
    if (!isEdit) return;

    const fetchInstance = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/admin/course-instances/${id}`);

        setFormData({
          courseTemplateId: data.courseTemplate?._id || "",
          academicYear: data.academicYear,
          grade: data.grade,
          section: data.section,
          teacherId: data.teacher?._id || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load course instance");
      } finally {
        setLoading(false);
      }
    };

    fetchInstance();
  }, [id, isEdit]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const { courseTemplateId, academicYear, grade, section } = formData;

    if (!courseTemplateId || !academicYear || !grade || !section) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await api.put(`/admin/course-instances/${id}`, formData);
      } else {
        await api.post("/admin/course-instances", formData);
      }

      navigate("/admin/course-instances");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">
          {isEdit ? "Edit Course Instance" : "Create Course Instance"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Bind a course template to a grade, section, and academic year
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 space-y-5"
        >
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* COURSE TEMPLATE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Template
            </label>
            <select
              name="courseTemplateId"
              value={formData.courseTemplateId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select course</option>
              {templates.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
          </div>

          {/* TEACHER (OPTIONAL) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Teacher (optional)
            </label>
            <select
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Assign later</option>
              {teachers.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* ACADEMIC YEAR */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Academic Year
            </label>
            <input
              type="text"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* GRADE & SECTION */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select grade</option>
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Section
              </label>
              <select
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              >
                <option value="">Select section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Instance"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CourseInstanceForm;
