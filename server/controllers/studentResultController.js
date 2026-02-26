import Result from "../models/Result.js";
import CourseInstance from "../models/CourseInstance.js";

export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { academicYear } = req.query;

    // 🔐 Role protection
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!academicYear) {
      return res.status(400).json({ message: "Academic year required" });
    }

    const results = await Result.find({
      student: studentId,
      academicYear,
    }).populate({
      path: "courseInstance",
      populate: {
        path: "courseTemplate",
        select: "name code",
      },
    });

    if (!results.length) {
      return res.json({
        student: {
          name: req.user.name,
          grade: req.user.studentProfile?.grade,
          section: req.user.studentProfile?.section,
          academicYear,
        },
        subjects: [],
        summary: {
          totalSubjects: 0,
          grandTotal: 0,
          overallAverage: 0,
        },
      });
    }

    let grandTotal = 0;

    const subjects = results.map((r) => {
      const semester1Total = r.semester1?.total || 0;
      const semester2Total = r.semester2?.total || 0;
      const yearTotal = r.yearTotal || 0;
      const yearAverage = r.yearFinalScore || 0;

      grandTotal += yearTotal;

      return {
        subjectName: r.courseInstance.courseTemplate.name,
        subjectCode: r.courseInstance.courseTemplate.code,
        semester1Total,
        semester2Total,
        yearTotal,
        yearAverage,
      };
    });

    const totalSubjects = subjects.length;
    const overallAverage =
      totalSubjects > 0 ? grandTotal / totalSubjects : 0;

    res.json({
      student: {
        name: req.user.name,
        grade: req.user.studentProfile?.grade,
        section: req.user.studentProfile?.section,
        academicYear,
      },
      subjects,
      summary: {
        totalSubjects,
        grandTotal,
        overallAverage,
      },
    });
  } catch (error) {
    console.error("Student result error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Add this to your existing controller file
export const getAvailableYears = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Finds all unique academicYear values for this student
    const years = await Result.distinct("academicYear", { student: studentId });

    // Sort years descending (newest first)
    const sortedYears = years.sort((a, b) => b.localeCompare(a));

    res.json(sortedYears);
  } catch (error) {
    console.error("Error fetching years:", error);
    res.status(500).json({ message: "Server error" });
  }
};