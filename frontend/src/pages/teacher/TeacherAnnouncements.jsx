import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Loader2 } from "lucide-react";
import QuillEditor from "../../components/QuillEditor"; // <-- React 19 compatible

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    contentHtml: "",
    audience: { roles: ["student"] },
    status: "draft",
  });

  // ================= FETCH =================
  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements/manage");
      setAnnouncements(res.data);
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.contentHtml) {
      setError("Title and content are required");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await api.put(`/announcements/manage/${editingId}`, form);
      } else {
        await api.post("/announcements/manage", form);
      }
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      setError(err.response?.data?.message || "Error saving announcement");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      title: "",
      contentHtml: "",
      audience: { roles: ["student"] },
      status: "draft",
    });
  };

  const handleEdit = (a) => {
    setEditingId(a._id);
    setForm({
      title: a.title,
      contentHtml: a.contentHtml,
      audience: a.audience,
      status: a.status,
    });
  };

  const handleArchive = async (id) => {
    try {
      await api.patch(`/announcements/manage/${id}/archive`);
      fetchAnnouncements();
    } catch (err) {
      setError("Archive failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Announcements</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        {/* ================= FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded p-6 mb-8"
        >
          <h2 className="font-semibold mb-4">
            {editingId ? "Edit Announcement" : "Create Announcement"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            className="w-full border p-2 mb-4 rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          {/* RICH TEXT EDITOR */}
          <div className="mb-4">
            <QuillEditor
              value={form.contentHtml}
              onChange={(html) => setForm({ ...form, contentHtml: html })}
            />
          </div>

          {/* Audience */}
          <div className="flex gap-6 mb-4">
            {["student", "teacher", "parent"].map((role) => (
              <label key={role}>
                <input
                  type="radio"
                  checked={form.audience.roles[0] === role}
                  onChange={() =>
                    setForm({ ...form, audience: { roles: [role] } })
                  }
                />
                <span className="ml-1 capitalize">{role}</span>
              </label>
            ))}
          </div>

          {/* Status */}
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border p-2 rounded mb-4"
          >
            <option value="draft">Draft</option>
            <option value="published">Publish</option>
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              {saving && <Loader2 className="animate-spin w-4 h-4" />}
              {editingId ? "Update" : "Create"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* ================= LIST ================= */}
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : (
          <div className="space-y-4">
            {announcements.map((a) => (
              <div key={a._id} className="bg-white shadow rounded p-4 border">
                <div className="flex justify-between">
                  <h3 className="font-bold">{a.title}</h3>
                  <span className="text-sm">{a.status}</span>
                </div>

                <div
                  className="mt-3 prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: a.contentHtml }}
                />

                <div className="flex gap-4 mt-4 text-sm">
                  <button
                    onClick={() => handleEdit(a)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>

                  {!a.isArchived && (
                    <button
                      onClick={() => handleArchive(a._id)}
                      className="text-red-600"
                    >
                      Archive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TeacherAnnouncements;
