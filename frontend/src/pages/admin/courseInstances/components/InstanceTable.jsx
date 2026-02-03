import { Link } from "react-router-dom";
import { Eye, Pencil } from "lucide-react";

const InstanceTable = ({ instances }) => {
  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          <th className="text-left px-4 py-3">Course</th>
          <th className="text-left px-4 py-3">Grade</th>
          <th className="text-left px-4 py-3">Section</th>
          <th className="text-left px-4 py-3">Academic Year</th>
          <th className="text-left px-4 py-3">Teacher</th>
          <th className="text-right px-4 py-3">Actions</th>
        </tr>
      </thead>

      <tbody>
        {instances.map((instance) => (
          <tr
            key={instance._id}
            className="border-b hover:bg-gray-50"
          >
            <td className="px-4 py-3 font-medium">
              {instance.courseTemplate?.name}
            </td>

            <td className="px-4 py-3">{instance.grade}</td>
            <td className="px-4 py-3">{instance.section}</td>
            <td className="px-4 py-3">{instance.academicYear}</td>

            <td className="px-4 py-3">
              {instance.teacher?.name || "—"}
            </td>

            <td className="px-4 py-3 text-right space-x-3">
              <Link
                to={`/admin/course-instances/${instance._id}`}
                className="inline-flex items-center gap-1 text-gray-700 hover:underline"
              >
                <Eye size={14} />
                View
              </Link>

              <Link
                to={`/admin/course-instances/${instance._id}/edit`}
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <Pencil size={14} />
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default InstanceTable;
