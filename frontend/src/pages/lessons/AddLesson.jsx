import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const AddLesson = () => {
  const { courseId } = useParams(); // ✅ CourseInstance ID
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || order === "") {
      setError("Title and order are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/lessons", {
  courseId,
  title,
  content,
  videoUrl,
  order: Number(order),
});

      navigate(`/teacher/courses/${courseId}/lessons`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Add New Lesson</h1>

      <form
        className="bg-white p-6 rounded shadow w-full max-w-xl"
        onSubmit={handleSubmit}
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 font-medium">Lesson Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded mb-4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Order (Lesson Number)</label>
        <input
          type="number"
          min="1"
          className="w-full p-2 border rounded mb-4"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Content</label>
        <textarea
          className="w-full p-2 border rounded mb-4 h-32"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label className="block mb-2 font-medium">Video URL (Optional)</label>
        <input
          type="url"
          className="w-full p-2 border rounded mb-4"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />

        <button
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Lesson"}
        </button>
      </form>
    </Layout>
  );
};

export default AddLesson;
