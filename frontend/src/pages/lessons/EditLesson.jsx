import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import QuillEditor from "../../components/QuillEditor";
import { Loader2 } from "lucide-react";

const EditLesson = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [order, setOrder] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD LESSON =================
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/lessons/${lessonId}`);

        setTitle(data.title);
        setContent(data.content || "");
        setVideoUrl(data.videoUrl || "");
        setOrder(data.order || "");
      } catch (err) {
        console.error("Failed to load lesson:", err);
        setError("Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  // ================= UPDATE LESSON =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || order === "") {
      setError("Title and order are required");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/lessons/${lessonId}`, {
        title,
        content,
        videoUrl,
        order: Number(order),
      });

      navigate(`/teacher/courses/${courseId}/lessons`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update lesson");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Edit Lesson</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow space-y-5"
        >
          {error && (
            <p className="text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block mb-2 font-medium">
              Lesson Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Order */}
          <div>
            <label className="block mb-2 font-medium">
              Order (Lesson Number)
            </label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              required
            />
          </div>

          {/* Content (Rich Text) */}
          <div>
            <label className="block mb-2 font-medium">
              Lesson Content
            </label>
            <QuillEditor
              value={content}
              onChange={(html) => setContent(html)}
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block mb-2 font-medium">
              Video URL (Optional)
            </label>
            <input
              type="url"
              className="w-full p-2 border rounded"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {saving && (
                <Loader2 className="animate-spin w-4 h-4" />
              )}
              Update Lesson
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(`/teacher/courses/${courseId}/lessons`)
              }
              className="bg-gray-500 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditLesson;