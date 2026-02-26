import Lesson from "../../models/Lesson.js";
import CourseInstance from "../../models/CourseInstance.js";
import Material from "../../models/Material.js";

export const getStudentLessonsByCourse = async (req, res) => {
  try {
    const student = req.user;
    const { id } = req.params;

    // ✅ FIX: Use the same extraction logic as MyCourses
    const { academicYear, classRoom } = student.studentProfile || {};
    const grade = student.studentProfile?.grade || classRoom?.grade;
    const section = student.studentProfile?.section || classRoom?.section;
    const year = academicYear || classRoom?.academicYear;

    // 🔒 Validate course access with the correct variables
    const course = await CourseInstance.findOne({
      _id: id,
      grade,
      section,
      academicYear: year, // Use the extracted year
      status: "active",
    });

    if (!course) {
      // 💡 Added debug info so you can see why it fails in the network tab
      return res.status(403).json({
        message: "Access denied to this course",
        debug: { grade, section, year } 
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

// ... keep getLessonMaterialsForStudent as is

export const getLessonMaterialsForStudent = async (req, res) => {
  const { lessonId } = req.params;

  const materials = await Material.find({ lesson: lessonId })
    .select("title fileUrl fileType")
    .sort({ createdAt: -1 });

  res.json(materials);
};

