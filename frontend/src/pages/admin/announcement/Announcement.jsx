import { useEffect, useState } from "react";
import api from "../../../api/axios";
import { Plus, Pencil, Archive, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QuillEditor from "../../../components/QuillEditor";

/* ===========================================================
   AdminAnnouncements
=========================================================== */

const AdminAnnouncements = () => {
  const navigate = useNavigate();

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
      const { data } = await api.get("/announcements/manage");
      setAnnouncements(data);
    } catch (err) {
      console.error("Fetch announcements failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (id) => {
    if (!window.confirm("Archive this announcement?")) return;

    try {
      await api.patch(`/announcements/manage/${id}/archive`);
      fetchAnnouncements();
    } catch (err) {
      console.error("Archive failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Announcements
          </h1>
          <p className="text-sm text-gray-500">
            Broadcast important messages to users
          </p>
        </div>

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

      {/* Table */}
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
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  Loading announcements...
                </td>
              </tr>
            ) : announcements.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No announcements yet
                </td>
              </tr>
            ) : (
              announcements.map((a) => (
                <tr
                  key={a._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {a.title}
                  </td>

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
                        onClick={() =>
                          navigate(`/admin/announcements/${a._id}`)
                        }
                      />
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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {openForm && (
        <AnnouncementForm
          initialData={editing}
          onClose={() => setOpenForm(false)}
          onSaved={fetchAnnouncements}
        />
      )}
    </div>
  );
};

export default AdminAnnouncements;

/* ===========================================================
   AnnouncementForm
=========================================================== */

const AnnouncementForm = ({ initialData, onClose, onSaved }) => {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    contentHtml: initialData?.contentHtml || "",
    audience:
      initialData?.audience || {
        roles: ["student", "teacher", "parent"],
      },
    status: initialData?.status || "draft",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (!form.title || !form.contentHtml) {
      setError("Title and content are required");
      setSubmitting(false);
      return;
    }

    try {
      if (initialData?._id) {
        await api.put(
          `/announcements/manage/${initialData._id}`,
          form
        );
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
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 space-y-5 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {initialData ? "Edit Announcement" : "New Announcement"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-3 py-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Title</label>
            <input
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              required
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Message
            </label>
            <QuillEditor
              value={form.contentHtml}
              onChange={(html) =>
                setForm({ ...form, contentHtml: html })
              }
            />
          </div>

          {/* Audience */}
          <div>
            <label className="text-sm font-medium block mb-2">
              Audience
            </label>
            <div className="flex gap-6">
              {["student", "teacher", "parent"].map((role) => (
                <label key={role} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.audience.roles.includes(role)}
                    onChange={(e) => {
                      let roles = [...form.audience.roles];

                      if (e.target.checked) {
                        roles.push(role);
                      } else {
                        roles = roles.filter((r) => r !== role);
                      }

                      setForm({
                        ...form,
                        audience: { ...form.audience, roles },
                      });
                    }}
                  />
                  <span className="capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              className="w-full border rounded-lg px-3 py-2 mt-1"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-60"
            >
              {submitting && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {initialData ? "Update Announcement" : "Save Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
