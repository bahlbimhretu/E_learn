// controllers/studentLessonController.js
import Lesson from "../../models/Lesson.js";
import CourseInstance from "../../models/CourseInstance.js";
import Material from "../../models/Material.js";

export const getStudentLessonsByCourse = async (req, res) => {
  try {
    const student = req.user;
    const { id } = req.params;

    const { grade, section, academicYear } = student.studentProfile || {};

    // 🔒 Validate course access first
    const course = await CourseInstance.findOne({
      _id: id,
      grade,
      section,
      academicYear,
      status: "active",
    });

    if (!course) {
      return res.status(403).json({
        message: "Access denied to this course",
      });
    }

    const lessons = await Lesson.find({ course: id })
      .sort({ order: 1 })
      .select("title content videoUrl order createdAt");

    res.json(lessons);
  } catch (error) {
    console.error("Student lesson fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLessonMaterialsForStudent = async (req, res) => {
  const { lessonId } = req.params;

  const materials = await Material.find({ lesson: lessonId })
    .select("title fileUrl fileType")
    .sort({ createdAt: -1 });

  res.json(materials);
};

