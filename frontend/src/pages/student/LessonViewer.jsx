import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LessonMaterials from "./LessonMaterials";
import LessonAssignmentsStudent from "../student/LessonAssignmentsStudent";
import api from "../../api/axios";

/* ----------------------------
   Extract YouTube Video ID
----------------------------- */
const getYouTubeId = (url) => {
  if (!url) return null;

  if (url.includes("watch?v=")) {
    return url.split("watch?v=")[1].split("&")[0];
  }

  if (url.includes("youtu.be/")) {
    return url.split("youtu.be/")[1].split("?")[0];
  }

  if (url.includes("youtube.com/embed/")) {
    return url.split("embed/")[1];
  }

  return null;
};

const LessonViewer = ({
  lessons,
  currentIndex,
  setCurrentIndex,
  courseId,
}) => {
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState(0);

  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const completedRef = useRef(false);

  const lesson = lessons[currentIndex];

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < lessons.length - 1;

  /* ----------------------------
     Fetch Course Progress
  ----------------------------- */
  const fetchProgress = async () => {
    if (!courseId) return;

    try {
      const res = await api.get(`/progress/${courseId}`);
      setProgress(res.data.percentage || 0);
    } catch (err) {
      console.error("Failed to fetch progress:", err);
    }
  };

  /* ----------------------------
     Load YouTube API Once
  ----------------------------- */
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
  }, []);

  /* ----------------------------
     Fetch Progress On Load
  ----------------------------- */
  useEffect(() => {
    fetchProgress();
  }, [courseId]);

  /* ----------------------------
     Fetch Materials
  ----------------------------- */
  useEffect(() => {
    if (!lesson?._id) {
      setMaterials([]);
      return;
    }

    const fetchMaterials = async () => {
      try {
        const res = await api.get(`/materials/lesson/${lesson._id}`);
        setMaterials(res.data);
      } catch (err) {
        console.error("Failed to fetch materials:", err);
        setMaterials([]);
      }
    };

    fetchMaterials();
  }, [lesson?._id]);

  /* ----------------------------
     Auto Completion Logic
  ----------------------------- */
  const checkProgress = async () => {
    if (!playerRef.current || completedRef.current) return;

    const duration = playerRef.current.getDuration();
    const currentTime = playerRef.current.getCurrentTime();

    if (!duration) return;

    const percentage = (currentTime / duration) * 100;

    if (percentage >= 90) {
      completedRef.current = true;
      clearInterval(intervalRef.current);

      try {
        await api.post("/progress/complete", {
          lessonId: lesson._id,
          courseId: courseId,
        });

        await fetchProgress(); // refresh progress bar
      } catch (err) {
        console.error("Auto-complete failed:", err);
      }
    }
  };

  /* ----------------------------
     Initialize Player On Lesson Change
  ----------------------------- */
  useEffect(() => {
    if (!lesson?.videoUrl) return;

    completedRef.current = false;
    clearInterval(intervalRef.current);

    const videoId = getYouTubeId(lesson.videoUrl);
    if (!videoId) return;

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId,
        events: {
          onReady: () => {
            intervalRef.current = setInterval(checkProgress, 5000);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      clearInterval(intervalRef.current);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [lesson?._id]);

  if (!lesson) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border">

      {/* =========================
          COMPLETION BAR
      ========================== */}
      <div className="p-4 border-b bg-slate-50">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Course Progress</span>
          <span className="font-semibold text-blue-600">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded h-3">
          <div
            className="bg-blue-600 h-3 rounded transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

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
            <div id="youtube-player" className="w-full h-full" />
          </div>
        )}

        {/* Materials */}
        <LessonMaterials materials={materials} />

        {/* Text Content */}
        {lesson.content && (
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        )}

        {/* Assignments */}
        <LessonAssignmentsStudent lessonId={lesson._id} />
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
          <ChevronLeft size={16} /> Previous
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
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default LessonViewer;