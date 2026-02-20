import { useEffect, useState } from "react";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { Loader2 } from "lucide-react";

const ParentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await api.get("/announcements/feed");
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to load announcements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Announcements
        </h1>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
          </div>
        ) : announcements.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No announcements available.
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h2>
                  <span className="text-xs text-gray-400">
                    {new Date(
                      item.publishedAt || item.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div
                  className="prose max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: item.contentHtml,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ParentAnnouncements;
