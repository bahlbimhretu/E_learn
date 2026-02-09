import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Plus, Pencil, Archive, Eye, Loader2 } from "lucide-react";

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/announcements/feed"); // Teacher-specific feed
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch teacher announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this announcement?")) return;
    try {
      await api.patch(`/announcements/${id}/archive`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to archive announcement:", err);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Announcements</h1>

          <button
            onClick={() => {
              setEditing(null);
              setOpenForm(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            New Announcement
          </button>
        </div>

        {/* Announcements Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Audience</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Loading announcements...
                  </td>
                </tr>
              ) : announcements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No announcements
                  </td>
                </tr>
              ) : (
                announcements.map((a) => (
                  <tr key={a._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{a.title}</td>
                    <td className="px-4 py-3">
                      {a.audience
                        ? [
                            a.audience.roles?.join(", "),
                            a.audience.grades?.join(", "),
                            a.audience.sections?.join(", "),
                          ]
                            .filter(Boolean)
                            .join(" | ")
                        : "All"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          a.status === "published"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <Eye
                          className="w-4 h-4 cursor-pointer text-gray-500"
                          onClick={() => window.alert("Feature: view full content")}
                        />
                        {a.creatorRole === "teacher" && (
                          <>
                            <Pencil
                              className="w-4 h-4 cursor-pointer text-blue-600"
                              onClick={() => {
                                setEditing(a);
                                setOpenForm(true);
                              }}
                            />
                            <Archive
                              className="w-4 h-4 cursor-pointer text-red-600"
                              onClick={() => handleArchive(a._id)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Announcement Form Modal */}
        {openForm && (
          <AnnouncementForm
            initialData={editing}
            onClose={() => setOpenForm(false)}
            onSaved={fetchAnnouncements}
          />
        )}
      </div>
    </Layout>
  );
};

export default TeacherAnnouncements;

/* ===================================================
   AnnouncementForm Component
=================================================== */
const AnnouncementForm = ({ initialData, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    contentHtml: initialData?.contentHtml || "",
    audience: initialData?.audience || { roles: ["student", "parent"] },
    status: initialData?.status || "draft",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (initialData?._id) {
        await api.put(`/announcements/manage/${initialData._id}`, form);
      } else {
        await api.post("/announcements/manage", form);
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Failed to save announcement");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-5">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {initialData ? "Edit Announcement" : "New Announcement"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 h-32"
              value={form.contentHtml}
              onChange={(e) => setForm({ ...form, contentHtml: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full border rounded-lg px-3 py-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Announcement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
