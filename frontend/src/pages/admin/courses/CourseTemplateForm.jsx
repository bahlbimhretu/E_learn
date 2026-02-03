import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../../layout/AdminLayout";
import api from "../../../api/axios";

const CourseTemplateForm = () => {
  const { id } = useParams(); // edit mode if id exists
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    code: "",
    grade: "",
    category: "Other",
    description: "",
    creditHours: 4,
    isElective: false,
    thumbnail: "",
  });

  const [error, setError] = useState(null);

  /* ---------------- FETCH FOR EDIT ---------------- */
  useEffect(() => {
    if (!isEdit) return;

    const fetchCourseTemplate = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/admin/course-templates/${id}`);
        setForm({
          name: data.name || "",
          code: data.code || "",
          grade: data.grade || "",
          category: data.category || "Other",
          description: data.description || "",
          creditHours: data.creditHours || 4,
          isElective: data.isElective || false,
          thumbnail: data.thumbnail || "",
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load course template");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseTemplate();
  }, [id, isEdit]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!form.name || !form.code || !form.grade) {
    setError("Name, Code, and Grade are required.");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    if (isEdit) {
      await api.put(`/admin/course-templates/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      await api.post("/admin/course-templates", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    navigate("/admin/courses");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  /* ---------------- UI ---------------- */
  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {isEdit ? "Edit Course Template" : "Create Course Template"}
          </h1>
          <p className="text-sm text-gray-500">
            Course templates define reusable academic courses
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-6 space-y-5"
        >
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="Mathematics"
            />
          </div>

          {/* CODE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Course Code *
            </label>
            <input
              type="text"
              name="code"
              value={form.code}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
              placeholder="MTH-09"
            />
          </div>

          {/* GRADE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Grade *
            </label>
            <select
              name="grade"
              value={form.grade}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Grade</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="Science">Science</option>
              <option value="Language">Language</option>
              <option value="Math">Math</option>
              <option value="Social">Social</option>
              <option value="ICT">ICT</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* CREDIT HOURS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Credit Hours
            </label>
            <input
              type="number"
              name="creditHours"
              value={form.creditHours}
              onChange={handleChange}
              min={1}
              max={12}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          {/* ELECTIVE */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isElective"
              checked={form.isElective}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <label className="text-sm font-medium">Is Elective?</label>
          </div>
          {/* THUMBNAIL */}
{/* THUMBNAIL UPLOAD */}
<div>
  <label className="block text-sm font-medium mb-1">
    Course Thumbnail
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => setThumbnailFile(e.target.files[0])}
    className="w-full border px-3 py-2 rounded"
  />

  <p className="text-xs text-gray-500 mt-1">
    JPG, PNG, or WEBP. Recommended 16:9 ratio.
  </p>
</div>


          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-3 py-2 rounded"
              placeholder="Optional course description"
            />
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
              {loading
                ? "Saving..."
                : isEdit
                ? "Update Course"
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CourseTemplateForm;
