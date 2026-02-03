import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Layout from "../../layout/Layout";
import { AuthContext } from "../../context/AuthContext";

const CoursesList = () => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, [user]); // reload when user changes

  const loadCourses = async () => {
    try {
      let res;

      // Admin gets all courses
      if (user.role === "admin") {
        res = await api.get("/courses");
      }

      // Teacher gets only their own courses
      else if (user.role === "teacher") {
        res = await api.get("/courses/teacher/my-courses");
      }

      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>

        {(user.role === "admin" || user.role === "teacher") && (
          <Link to="/courses/new" className="bg-blue-600 text-white px-4 py-2 rounded">
            + Add Course
          </Link>
        )}
      </div>

      <div className="bg-white shadow rounded p-6 overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left">Thumbnail</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Created By</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                
                {/* THUMBNAIL COLUMN */}
                <td className="p-3">
                  {c.thumbnail ? (
                    <img
                      src={`http://localhost:5000/uploads/${c.thumbnail}`}
                      alt="thumbnail"
                      className="h-12 w-16 object-cover rounded border"
                    />
                  ) : (
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs">
                      No image
                    </span>
                  )}
                </td>

                <td className="p-3">{c.title}</td>
                <td className="p-3">{c.category}</td>
                <td className="p-3">{c.createdBy?.name}</td>

                {/* ACTIONS */}
                <td className="p-3 space-x-3">
                  {(user.role === "admin" || user._id === c.createdBy?._id) && (
                    <Link to={`/courses/edit/${c._id}`} className="text-blue-600">
                      Edit
                    </Link>
                  )}

                  <Link to={`/courses/${c._id}`} className="text-green-600">
                    View
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default CoursesList;
