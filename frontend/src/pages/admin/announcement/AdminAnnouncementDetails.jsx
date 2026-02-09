import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const AdminAnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/announcements/${id}`);
        setAnnouncement(data);
      } catch (err) {
        console.error("Fetch announcement failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600" />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Announcement not found
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Card */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">
          {announcement.title}
        </h1>

        {/* Content */}
        <div className="prose max-w-none text-gray-700">
          <div
            dangerouslySetInnerHTML={{
              __html: announcement.contentHtml,
            }}
          />
        </div>

        {/* Meta */}
        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Audience:</span>{" "}
            {announcement.audience
              ? [
                  announcement.audience.roles?.join(", "),
                  announcement.audience.grades?.join(", "),
                  announcement.audience.sections?.join(", "),
                ]
                  .filter(Boolean)
                  .join(" | ")
              : "All"}
          </div>

          <div>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                announcement.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {announcement.status}
            </span>
          </div>

          <div>
            <span className="font-semibold">Created:</span>{" "}
            {new Date(announcement.createdAt).toLocaleDateString()}
          </div>

          {announcement.publishedAt && (
            <div>
              <span className="font-semibold">Published:</span>{" "}
              {new Date(announcement.publishedAt).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementDetails;
