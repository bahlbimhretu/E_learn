import LessonProgress from "../models/LessonProgress.js";

export const markLessonCompleted = async (req, res) => {
  try {
    const { lessonId, courseId } = req.body;

    console.log("Incoming:", lessonId, courseId);
    console.log("User:", req.user);

    const studentId = req.user.id;

    const progress = await LessonProgress.create({
      student: studentId,
      course: courseId,
      lesson: lessonId,
    });

    res.status(201).json(progress);

  } catch (error) {
    console.error("ERROR IN markLessonCompleted:", error);
    res.status(500).json({ message: error.message });
  }
};
import Lesson from "../models/Lesson.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const totalLessons = await Lesson.countDocuments({
      course: courseId,
    });

    const completedLessons = await LessonProgress.countDocuments({
      course: courseId,
      student: studentId,
    });

    const percentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    res.json({
      totalLessons,
      completedLessons,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};