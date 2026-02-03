import { Pencil, Archive, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const CourseInstanceCard = ({ instance, onArchive, onRestore }) => {
  const isArchived = instance.status === "archived";
  const template = instance.courseTemplate || {};
  const thumbnail = template.thumbnail
    ? `http://localhost:5000${template.thumbnail}`
    : "/images/course-default.png";

  return (
    <div
      className={`group relative rounded-xl border bg-white overflow-hidden transition
        ${isArchived ? "opacity-60" : "hover:shadow-lg hover:-translate-y-1"}
      `}
    >
      <Link to={`/admin/course-instances/${instance._id}`}>
        <div className="relative h-40 overflow-hidden">
          <img
            src={thumbnail}
            alt={template.name}
            className={`w-full h-full object-cover transition
              ${isArchived ? "grayscale" : "group-hover:scale-105"}
            `}
          />

          <span
            className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full
              ${isArchived ? "bg-gray-700 text-white" : "bg-green-600 text-white"}
            `}
          >
            {isArchived ? "Archived" : "Active"}
          </span>
        </div>

        <div className="p-4 space-y-1">
          <h3 className="font-semibold text-gray-900 leading-tight">
            {template.name} ({template.code})
          </h3>

          <p className="text-sm text-gray-500">
            {instance.grade} • Section {instance.section} • {instance.academicYear}
          </p>

          <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
            {template.category}
          </span>
        </div>
      </Link>

      <div className="absolute inset-x-0 bottom-0 p-3 flex justify-end gap-2 bg-white/90 opacity-0 group-hover:opacity-100 transition">
        {!isArchived ? (
          <>
            <Link
              to={`/admin/course-instances/${instance._id}`}
              className="p-2 rounded hover:bg-blue-50 text-blue-600"
              title="Edit"
            >
              <Pencil size={16} />
            </Link>

            <button
              onClick={() => onArchive(instance._id)}
              className="p-2 rounded hover:bg-red-50 text-red-600"
              title="Archive"
            >
              <Archive size={16} />
            </button>
          </>
        ) : (
          <button
  onClick={() => onRestore(instance._id)}
  className="p-2 rounded hover:bg-green-50 text-green-600"
  title="Restore"
>
  <RotateCcw size={16} />
</button>

        )}
      </div>
    </div>
  );
};

export default CourseInstanceCard;
