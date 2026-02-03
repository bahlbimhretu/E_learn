import { NavLink } from "react-router-dom";

const CourseSwitcher = () => {
  return (
    <div className="flex gap-2 border rounded-lg p-1 bg-gray-100 w-fit">
      <NavLink
        to="/admin/courses"
        className={({ isActive }) =>
          `px-4 py-1.5 rounded-md text-sm transition
          ${isActive ? "bg-white shadow font-medium" : "text-gray-600 hover:text-gray-800"}`
        }
      >
        Course Templates
      </NavLink>

      <NavLink
        to="/admin/course-instances"
        className={({ isActive }) =>
          `px-4 py-1.5 rounded-md text-sm transition
          ${isActive ? "bg-white shadow font-medium" : "text-gray-600 hover:text-gray-800"}`
        }
      >
        Course Instances
      </NavLink>
    </div>
  );
};

export default CourseSwitcher;
