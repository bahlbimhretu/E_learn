import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { Loader2, ArrowLeft } from "lucide-react";

const AdminAnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/announcements/${id}`);
        setAnnouncement(data);
      } catch (err) {
        console.error("Fetch announcement failed:", err);
        setError("Failed to load announcement");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        {error || "Announcement not found"}
      </div>
    );
  }

  const audienceText = announcement.audience
    ? [
        announcement.audience.roles?.join(", "),
        announcement.audience.grades?.join(", "),
        announcement.audience.sections?.join(", "),
      ]
        .filter(Boolean)
        .join(" | ")
    : "All Users";

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Card */}
      <div className="bg-white shadow-lg rounded-xl p-8 space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {announcement.title}
          </h1>

          <div className="mt-3 flex gap-3 flex-wrap">
            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                announcement.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {announcement.status}
            </span>

            {announcement.isArchived && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                Archived
              </span>
            )}
          </div>
        </div>

        {/* Content (Quill HTML) */}
        <div className="prose max-w-none break-words">
          {announcement.contentHtml ? (
            <div
              dangerouslySetInnerHTML={{
                __html: announcement.contentHtml,
              }}
            />
          ) : (
            <p className="text-gray-500 italic">
              No content available
            </p>
          )}
        </div>

        {/* Meta Info */}
        <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Audience:</span>
            <div className="mt-1">{audienceText}</div>
          </div>

          <div>
            <span className="font-semibold">Created:</span>
            <div className="mt-1">
              {new Date(announcement.createdAt).toLocaleDateString()}
            </div>
          </div>

          {announcement.publishedAt && (
            <div>
              <span className="font-semibold">Published:</span>
              <div className="mt-1">
                {new Date(
                  announcement.publishedAt
                ).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementDetails;