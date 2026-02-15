import { FileText, Image as ImageIcon, Play, Download } from "lucide-react";

const BASE_URL = "http://localhost:5000"; // or use env variable

const LessonMaterials = ({ materials }) => {
  if (!materials || materials.length === 0) {
    return (
      <p className="text-gray-500 italic">No materials for this lesson.</p>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800">Lesson Materials</h3>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {materials.map((m) => (
          <div
            key={m._id}
            className="flex flex-col border rounded-xl p-4 bg-slate-50 hover:shadow-lg transition shadow-sm"
          >
            {/* File Icon + Title */}
            <div className="flex items-center gap-3 mb-3">
              {m.fileType === "pdf" && <FileText className="text-red-600" size={20} />}
              {m.fileType === "image" && <ImageIcon className="text-blue-600" size={20} />}
              {m.fileType === "video" && <Play className="text-green-600" size={20} />}
              <span className="font-medium text-slate-700 truncate">{m.title}</span>
            </div>

            {/* File Preview / Link */}
            {m.fileType === "pdf" && (
              <a
                href={`${BASE_URL}${m.fileUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-1"
              >
                Open PDF
              </a>
            )}

            {m.fileType === "image" && (
              <img
                src={`${BASE_URL}${m.fileUrl}`}
                alt={m.title}
                className="rounded-lg border max-h-40 object-cover mb-1"
              />
            )}

            {m.fileType === "video" && (
              <video
                controls
                src={`${BASE_URL}${m.fileUrl}`}
                className="rounded-lg border max-h-40 mb-1"
              />
            )}

            {/* Download Button */}
            <a
              href={`${BASE_URL}${m.fileUrl}`}
              download
              className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <Download size={14} /> Download
            </a>

            {/* Upload Date */}
            <span className="text-xs text-gray-400 mt-1">
              Uploaded: {new Date(m.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonMaterials;
