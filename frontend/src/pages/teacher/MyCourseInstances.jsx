import { useEffect, useState } from "react";
import { fetchMyCourseInstances } from "./courseInstanceService";
import { Link } from "react-router-dom";
import Layout from "../../layout/Layout";

const MyCourseInstances = () => {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInstances = async () => {
      try {
        const data = await fetchMyCourseInstances();
        setInstances(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load course instances");
      } finally {
        setLoading(false);
      }
    };

    loadInstances();
  }, []);

  if (loading) return <p>Loading course instances...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold mb-6">My Course Instances</h1>

        {instances.length === 0 ? (
          <p>No course instances assigned yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {instances.map((instance) => (
              <Link
                key={instance._id}
                to={`/teacher/course-instances/${instance._id}`}
                className="block"
              >
                <div className="border rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow bg-white">
                  {/* Thumbnail */}
                  <div className="mb-3">
                    <img
  src={
    instance.courseTemplate?.thumbnail
      ? `http://localhost:5000${instance.courseTemplate.thumbnail}`
      : "/placeholder.jpg"
  }
  alt={instance.courseTemplate?.name || "Course thumbnail"}
  className="w-full h-40 object-cover rounded-lg"
 />


                  </div>

                  {/* Course Name */}
                  <h2 className="text-lg font-semibold mb-1">
                    {instance.courseTemplate?.name || "Untitled"}
                  </h2>

                  {/* Category */}
                  <p className="text-sm text-gray-500 mb-3">
                    {instance.courseTemplate?.category || "N/A"}
                  </p>

                  {/* Details */}
                  <div className="text-sm space-y-1">
                    <p>
                      <span className="font-medium">Grade:</span> {instance.grade}
                    </p>
                    <p>
                      <span className="font-medium">Section:</span> {instance.section}
                    </p>
                    <p>
                      <span className="font-medium">Year:</span> {instance.academicYear}
                    </p>
                  </div>

                  {/* Link */}
                  <div className="mt-4 text-blue-600 text-sm font-medium">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyCourseInstances;
