import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const UploadMaterial = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("courseId", courseId);
      formData.append("file", file);

     await api.post("/materials/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

      navigate(`/teacher/courses/${courseId}/materials`);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Upload Course Material</h1>

      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded shadow w-full max-w-xl"
      >
        {error && <p className="text-red-500 mb-3">{error}</p>}

        <label className="block mb-2 font-medium">Material Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          placeholder="e.g., Chapter 1 Notes"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Choose File</label>
        <input
          type="file"
          className="w-full p-2 border rounded mb-4"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Material"}
        </button>
      </form>
    </Layout>
  );
};

export default UploadMaterial;
