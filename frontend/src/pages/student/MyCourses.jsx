import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";
import Layout from "../../layout/Layout";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/student/course-instances");
        setCourses(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!courses.length) {
    return ( <Layout>
      <div className="text-center mt-20 text-gray-500">
        <p className="text-lg font-medium">No courses found</p>
        <p className="text-sm">Your courses will appear here automatically.</p>
      </div>
    </Layout>);
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          My Courses
        </h1> 
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course._id}
            onClick={() => navigate(`/my-courses/${course._id}`)}
            className="cursor-pointer rounded-xl border bg-white shadow-sm hover:shadow-md transition overflow-hidden"
          >
            {/* Thumbnail */}
           <div className="h-40 bg-gray-100"> 
            {course.thumbnail ? (
              <img
  src={`http://localhost:5000${course.thumbnail}`}
  alt={course.courseName}
  className="w-full h-full object-cover"
/>

            ) : ( <div className="flex items-center justify-center h-full text-gray-400"> No Image </div> )}
             </div>

            {/* Content */}
            <div className="p-4">
              <h2 className="font-semibold text-lg text-slate-800 truncate">
                {course.courseName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Teacher: {course.teacherName}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Grade {course.grade} • Section {course.section}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                Academic Year: {course.academicYear}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </Layout>
  );
};

export default MyCourses;
