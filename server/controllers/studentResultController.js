import Result from "../models/Result.js";
import User from "../models/Users.js";

// ==========================================
// GET STUDENT RESULTS BY ACADEMIC YEAR
// ==========================================
export const getStudentResults = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { academicYear } = req.query;

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    if (!academicYear) {
      return res.status(400).json({ message: "Academic year required" });
    }

    const student = await User.findById(studentId).populate(
      "studentProfile.classRoom"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const grade = student.studentProfile?.classRoom?.grade || "";
    const section = student.studentProfile?.classRoom?.section || "";

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
          name: student.name,
          grade,
          section,
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

      const yearTotal = semester1Total + semester2Total;
      const yearAverage = yearTotal / 2;

      grandTotal += yearTotal;

      return {
        subjectName: r.courseInstance?.courseTemplate?.name || "Unknown",
        subjectCode: r.courseInstance?.courseTemplate?.code || "-",
        semester1Total,
        semester2Total,
        yearTotal,
        yearAverage: Number(yearAverage.toFixed(2)),
      };
    });

    const totalSubjects = subjects.length;

    const overallAverage =
      totalSubjects > 0 ? grandTotal / (totalSubjects * 2) : 0;

    res.json({
      student: {
        name: student.name,
        grade,
        section,
        academicYear,
      },
      subjects,
      summary: {
        totalSubjects,
        grandTotal,
        overallAverage: Number(overallAverage.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("Student result error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================================
// GET AVAILABLE YEARS
// ==========================================
export const getAvailableYears = async (req, res) => {
  try {
    const studentId = req.user._id;

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Access denied" });
    }

    const years = await Result.distinct("academicYear", {
      student: studentId,
    });

    const sortedYears = years.sort((a, b) => b.localeCompare(a));

    res.json(sortedYears);
  } catch (error) {
    console.error("Error fetching academic years:", error);
    res.status(500).json({ message: "Server error" });
  }
};