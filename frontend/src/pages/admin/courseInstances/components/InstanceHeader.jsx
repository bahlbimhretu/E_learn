import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";

const InstanceHeader = ({ instance, onBack }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">
          {instance.courseTemplate?.name}
        </h1>
        <p className="text-sm text-gray-500">
          Grade {instance.grade} • Section {instance.section} •{" "}
          {instance.academicYear}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="border px-4 py-2 rounded"
        >
          ← Back
        </button>

        <Link
          to={`/admin/course-instances/${instance._id}/edit`}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded"
        >
          <Pencil size={16} />
          Edit
        </Link>
      </div>
    </div>
  );
};

export default InstanceHeader;
