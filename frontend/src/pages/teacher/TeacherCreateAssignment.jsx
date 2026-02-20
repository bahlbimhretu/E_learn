import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const TeacherCreateAssignment = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    totalMarks: ""
  });
  
  // 1. Added state for the file
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    } else if (new Date(formData.dueDate) <= new Date()) {
      newErrors.dueDate = "Due date must be in the future";
    }
    if (!formData.totalMarks) newErrors.totalMarks = "Total marks required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;

    try {
      setLoading(true);

      // 3. Use FormData for multipart/form-data upload
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("dueDate", formData.dueDate);
      data.append("totalMarks", formData.totalMarks);
      data.append("lessonId", lessonId);
      
      // Only append if a file was actually selected
      if (file) {
        data.append("file", file);
      }

      await api.post("/assignments", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setServerMessage("Assignment created successfully!");
      setTimeout(() => {
        navigate(`/teacher/course/${courseId}`);
      }, 1200);
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Assignment</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title, Description, Due Date, Total Marks inputs remain the same... */}
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea name="description" rows="4" value={formData.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500" />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* 4. Added File Upload Input */}
          <div>
            <label className="block font-medium mb-1">Assignment File (Optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Due Date</label>
              <input type="datetime-local" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block font-medium mb-1">Total Marks</label>
              <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
              {errors.totalMarks && <p className="text-red-500 text-sm mt-1">{errors.totalMarks}</p>}
            </div>
          </div>

          {serverMessage && (
            <p className={`text-sm ${serverMessage.includes("success") ? "text-green-600" : "text-red-600"}`}>
              {serverMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white font-medium ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
          >
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default TeacherCreateAssignment;