import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const UploadMaterial = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  console.log("PARAMS:", courseId, lessonId);

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    // 🔐 Safety checks
    if (!courseId || !lessonId) {
      setError("Invalid course or lesson.");
      return;
    }

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!file) {
      setError("Please choose a file.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseId", courseId);
      formData.append("lessonId", lessonId);
      formData.append("file", file);

      await api.post("/materials", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // ✅ Redirect to lesson page after upload
      navigate(`/teacher/courses/${courseId}/lessons`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Upload Lesson Material</h1>

        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-lg shadow"
        >
          {error && (
            <p className="text-red-600 mb-4 font-medium">{error}</p>
          )}

          <label className="block mb-2 font-medium">Material Title</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="e.g. Chapter 1 PDF"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label className="block mb-2 font-medium">Choose File</label>
          <input
            type="file"
            className="w-full p-2 border rounded mb-6"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button
            type="submit"
            disabled={uploading}
            className={`px-6 py-2 rounded text-white font-medium transition-colors ${
              uploading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Material"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default UploadMaterial;
