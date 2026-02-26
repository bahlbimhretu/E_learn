import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        
        const res = await api.get("/announcements/feed");
        setAnnouncements(res.data);
        console.log("API response:", res.data);
      } catch (err) {
        console.error("Announcement feed error:", err);
        setError("Failed to load announcements");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <p className="p-6 text-sm text-gray-500">
        Loading announcements…
      </p>
    );
  }

  if (error) {
    return (
      <p className="p-6 text-sm text-red-500">
        {error}
      </p>
    );
  }

  return (
    <Layout>
    <div className="p-6 max-w-4xl space-y-4">
      <h1 className="text-xl font-semibold">
        Announcements
      </h1>

      {announcements.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No announcements available
        </p>
      ) : (
        announcements.map((a) => (
          <div
            key={a._id}
            className="bg-white border rounded-xl p-5"
          >
            <h2 className="font-semibold text-base">
              {a.title}
            </h2>

            <div
              className="prose prose-sm mt-2 max-w-none"
              dangerouslySetInnerHTML={{ __html: a.contentHtml }}
            />

            {a.publishedAt && (
              <div className="text-xs text-gray-400 mt-3">
                Published on{" "}
                {new Date(a.publishedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        ))
      )}
    </div>
    </Layout>
  );
};

export default StudentAnnouncements;
