import CourseInstance from "../../models/CourseInstance.js";
import Result from "../../models/Result.js";
import { recalculateStudentSummary } from "../../services/summaryService.js";

/**
 * GET MARKS FOR COURSE (PER SEMESTER)
 * GET /api/teacher/course-instances/:id/marks?semester=1
 */
export const getCourseMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const semester = Number(req.query.semester) || 1;

    const course = await CourseInstance.findById(id)
      .populate("students", "name")
      .populate("courseTemplate");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const students = [];

    for (const student of course.students) {
      let result = await Result.findOne({
        student: student._id,
        courseInstance: course._id,
      });

      // create result if not exists
      if (!result) {
        result = await Result.create({
          student: student._id,
          courseInstance: course._id,
          academicYear: course.academicYear,
          grade: course.grade,
          section: course.section,
        });
      }

      const semData =
        semester === 1 ? result.semester1 : result.semester2;

      students.push({
        studentId: student._id,
        name: student.name,
        quiz1: semData.quiz1,
        mid: semData.mid,
        quiz2: semData.quiz2,
        participation: semData.participation,
        final: semData.final,
        total: semData.total,
      });
    }

    res.json({
      courseInfo: {
        subject: course.courseTemplate.name,
        grade: course.grade,
        section: course.section,
        academicYear: course.academicYear,
      },
      students,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * BULK UPDATE MARKS
 * PUT /api/teacher/course-instances/:id/marks
 */
export const updateCourseMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { semester, marks } = req.body;

    const course = await CourseInstance.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    for (const entry of marks) {
      const { studentId, quiz1, mid, quiz2, participation, final } = entry;

      const updateField =
        semester === 1 ? "semester1" : "semester2";

      const result = await Result.findOneAndUpdate(
        {
          student: studentId,
          courseInstance: id,
        },
        {
          [updateField]: {
            quiz1,
            mid,
            quiz2,
            participation,
            final,
          },
        },
        { new: true, upsert: true }
      );

      // 🔹 After each subject update, recalc summary + ranking
      await recalculateStudentSummary(
        studentId,
        course.academicYear,
        course.grade,
        course.section
      );
    }

    res.json({ message: "Marks updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
