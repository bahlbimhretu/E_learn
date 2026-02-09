import { FileText, Image as ImageIcon, ExternalLink } from "lucide-react";

const LessonMaterials = ({ materials }) => {
  if (!materials || materials.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">
        Lesson Materials
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {materials.map((m) => (
          <div
            key={m._id}
            className="border rounded-lg p-4 bg-slate-50"
          >
            <div className="flex items-center gap-3 mb-2">
              {m.fileType === "pdf" ? (
                <FileText className="text-red-600" size={20} />
              ) : (
                <ImageIcon className="text-blue-600" size={20} />
              )}
              <span className="font-medium text-slate-700">
                {m.title}
              </span>
            </div>

            {m.fileType === "pdf" && (
              <a
  href={`${BASE_URL}${m.fileUrl}`}
  target="_blank"
  rel="noopener noreferrer"
>
                Open PDF <ExternalLink size={14} />
              </a>
            )}

            {m.fileType === "image" && (
             <img
  src={`${BASE_URL}${m.fileUrl}`}
  alt={m.title}
/>

            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonMaterials;
