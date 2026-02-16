import CourseInstance from "../models/CourseInstance.js";
import Result from "../models/Result.js";
export const getCourseMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const semester = Number(req.query.semester) || 1;

    const course = await CourseInstance.findById(id)
      .populate("students", "name")
      .populate("courseTemplate", "name");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🔒 Ensure teacher owns this course
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const studentsData = [];

    for (const student of course.students) {
      let result = await Result.findOne({
        student: student._id,
        courseInstance: id,
      });

      if (!result) {
        result = await Result.create({
          student: student._id,
          courseInstance: id,
          academicYear: course.academicYear,
          grade: course.grade,
          section: course.section,
        });
      }

      const sem =
        semester === 1 ? result.semester1 : result.semester2;

      studentsData.push({
        studentId: student._id,
        name: student.name,
        quiz1: sem.quiz1,
        mid: sem.mid,
        quiz2: sem.quiz2,
        participation: sem.participation,
        final: sem.final,
        total: sem.total,
      });
    }

    res.json({
      courseInfo: {
        subject: course.courseTemplate.name,
        grade: course.grade,
        section: course.section,
        academicYear: course.academicYear,
      },
      students: studentsData,
    });
  } catch (error) {
    console.error("GET MARKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
export const updateCourseMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { semester, marks } = req.body;

    const course = await CourseInstance.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    for (const entry of marks) {
      const { studentId, quiz1, mid, quiz2, participation, final } = entry;

      let result = await Result.findOne({
        student: studentId,
        courseInstance: id,
      });

      if (!result) {
        result = new Result({
          student: studentId,
          courseInstance: id,
          academicYear: course.academicYear,
          grade: course.grade,
          section: course.section,
        });
      }

      const semField = semester === 1 ? "semester1" : "semester2";

      result[semField].quiz1 = quiz1;
      result[semField].mid = mid;
      result[semField].quiz2 = quiz2;
      result[semField].participation = participation;
      result[semField].final = final;

      await result.save(); // 🔥 triggers middleware
    }

    res.json({ message: "Marks updated successfully" });
  } catch (error) {
    console.error("UPDATE MARKS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

