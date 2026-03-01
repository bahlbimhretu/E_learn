import Lesson from "../../models/Lesson.js";
import CourseInstance from "../../models/CourseInstance.js";
import Material from "../../models/Material.js";

export const getStudentLessonsByCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params; // This is the CourseInstance ID

    // 1. Find the course strictly by ID first
    const course = await CourseInstance.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 2. CHECK ENROLLMENT: Does the 'students' array contain this student's ID?
    const isEnrolled = course.students.some(
      (studentId) => studentId.toString() === userId.toString()
    );

    // 3. VALIDATE ACCESS
    // Allow access if the student is enrolled OR if they are an admin
    if (!isEnrolled && req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied to this course",
        debug: {
          reason: "Student not found in enrollment list for this instance",
          studentId: userId,
          courseGrade: course.grade,
          studentCurrentGrade: req.user.studentProfile?.grade
        }
      });
    }

    // 4. FETCH LESSONS
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

