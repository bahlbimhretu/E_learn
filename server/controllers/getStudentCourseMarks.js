import CourseInstance from "../models/CourseInstance.js";
import Result from "../models/Result.js";

export const getStudentCourseMarks = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await CourseInstance.findById(id)
      .populate("courseTemplate", "name teacher");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔒 Ensure student belongs to this course
    if (!course.students.includes(req.user._id)) {
      return res.status(403).json({ message: "Not enrolled in this course" });
    }

    const result = await Result.findOne({
      student: req.user._id,
      courseInstance: id,
    });

    if (!result) {
      return res.json({
        courseInfo: {
          subject: course.courseTemplate.name,
          grade: course.grade,
          section: course.section,
          academicYear: course.academicYear,
        },
        semester1: {},
        semester2: {},
        yearFinalScore: 0,
      });
    }

    res.json({
      courseInfo: {
        subject: course.courseTemplate.name,
        grade: course.grade,
        section: course.section,
        academicYear: course.academicYear,
      },
      semester1: result.semester1,
      semester2: result.semester2,
      yearFinalScore: result.yearFinalScore,
    });
  } catch (error) {
    console.error("STUDENT MARKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
