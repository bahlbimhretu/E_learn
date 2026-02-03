import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMyCourseInstanceById } from "./courseInstanceService";
import Layout from "../../layout/Layout";

const CourseInstanceDetails = () => {
  const { id } = useParams();
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInstance = async () => {
      try {
        const data = await fetchMyCourseInstanceById(id);
        setInstance(data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load course instance"
        );
      } finally {
        setLoading(false);
      }
    };
    loadInstance();
  }, [id]);

  if (loading)
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <p className="text-red-500">{error}</p>
      </Layout>
    );

  if (!instance)
    return (
      <Layout>
        <p>Course instance not found.</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mt-6">
        {/* Course Card */}
       <div className="border rounded-xl p-6 shadow-sm hover:shadow-lg bg-white transition-shadow">
  <h2 className="text-2xl font-bold mb-2">
    {instance.courseTemplate?.name || "Untitled"}
  </h2>

  {/* Thumbnail */}
  <div className="mb-4">
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

  <p className="text-gray-500 mb-4">
    Category: {instance.courseTemplate?.category || "N/A"}
  </p>

  <div className="grid grid-cols-2 gap-4 mb-4">
    <p>
      <span className="font-medium">Section:</span> {instance.section}
    </p>
    <p>
      <span className="font-medium">Grade:</span> {instance.grade}
    </p>
    <p>
      <span className="font-medium">Academic Year:</span> {instance.academicYear}
    </p>
  </div>

  <h3 className="text-xl font-semibold mt-4 mb-2">Enrolled Students</h3>
  {instance.students?.length === 0 ? (
    <p>No students enrolled yet.</p>
  ) : (
    <ul className="divide-y">
      {instance.students.map((student) => (
        <li key={student._id} className="py-2 flex justify-between items-center">
          <span>{student.name}</span>
          <span className="text-gray-500 text-sm">{student.email}</span>
        </li>
      ))}
    </ul>
  )}
</div>

      </div>
    </Layout>
  );
};

export default CourseInstanceDetails;
