import { ChevronLeft, ChevronRight } from "lucide-react";
import LessonMaterials from "./LessonMaterials";

const getEmbedUrl = (url) => {
  if (!url) return "";

  if (url.includes("youtube.com/embed")) return url;

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
};


const LessonViewer = ({ lessons, currentIndex, setCurrentIndex }) => {
  const lesson = lessons[currentIndex];

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Lesson Header */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-slate-800">
          {lesson.order}. {lesson.title}
        </h2>
      </div>

      {/* Lesson Content */}
      <div className="p-6 space-y-6">
        {/* Video */}
        {lesson.videoUrl && (
          <div className="aspect-video rounded-lg overflow-hidden border">
            <iframe
              src={getEmbedUrl(lesson.videoUrl)}
              title={lesson.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
        )}
{/* Lesson Materials */}
<LessonMaterials materials={lesson.materials} />

        {/* Text Content */}
        {lesson.content && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-4 border-t bg-slate-50">
        <button
          disabled={!hasPrev}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
            ${
              hasPrev
                ? "bg-slate-200 hover:bg-slate-300 text-slate-700"
                : "opacity-40 cursor-not-allowed"
            }`}
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        <span className="text-sm text-gray-500">
          Lesson {currentIndex + 1} of {lessons.length}
        </span>

        <button
          disabled={!hasNext}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition
            ${
              hasNext
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "opacity-40 cursor-not-allowed"
            }`}
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;
