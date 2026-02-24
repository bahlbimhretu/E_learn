import ClassRoom from "../models/ClassRoom.js";
import User from "../models/Users.js";
import Result from "../models/Result.js";

// GET homeroom performance analytics
export const getHomeroomPerformance = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const semester = req.query.semester || "final"; // 1 | 2 | final
    const atRiskThreshold = 60;

    // ✅ find homeroom class
    const classRoom = await ClassRoom.findOne({
      homeRoomTeacher: teacherId,
      status: "active",
    });

    if (!classRoom) {
      return res.status(404).json({ message: "No homeroom assigned" });
    }

    // ✅ get students in class
    const students = await User.find({
      role: "student",
      status: "active",
      "studentProfile.classRoom": classRoom._id,
    }).select("name studentProfile");

    if (!students.length) {
      return res.json({
        classAverage: 0,
        students: [],
        atRiskCount: 0,
      });
    }

    // ✅ get results
    const results = await Result.find({
      student: { $in: students.map(s => s._id) },
      grade: classRoom.grade,
      section: classRoom.section,
      academicYear: classRoom.academicYear,
    }).populate("courseInstance", "subject");

    // 🔥 build student performance map
    const performanceMap = {};

    students.forEach(s => {
      performanceMap[s._id] = {
        studentId: s._id,
        name: s.name,
        average: 0,
        subjects: 0,
      };
    });

    results.forEach(r => {
      const score =
        semester === "1"
          ? r.semester1.total
          : semester === "2"
          ? r.semester2.total
          : r.yearFinalScore;

      if (score === undefined) return;

      performanceMap[r.student._id].average += score;
      performanceMap[r.student._id].subjects += 1;
    });

    const studentList = Object.values(performanceMap).map(s => {
      const avg =
        s.subjects > 0 ? s.average / s.subjects : 0;

      return {
        ...s,
        average: Math.round(avg),
        atRisk: avg < atRiskThreshold,
      };
    });

    // 🔥 ranking
    studentList.sort((a, b) => b.average - a.average);

    studentList.forEach((s, index) => {
      s.rank = index + 1;
    });

    // 🔥 class stats
    const classAverage =
      studentList.reduce((sum, s) => sum + s.average, 0) /
      studentList.length;

    const atRiskCount = studentList.filter(
      s => s.atRisk
    ).length;

    res.json({
      classInfo: classRoom,
      classAverage: Math.round(classAverage),
      atRiskCount,
      totalStudents: studentList.length,
      students: studentList,
    });
  } catch (error) {
    console.error("Homeroom performance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getStudentPerformanceReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId)
      .select("name studentProfile")
      .populate("studentProfile.classRoom");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const classRoom = student.studentProfile?.classRoom;

    const results = await Result.find({ student: studentId })
      .populate({
        path: "courseInstance",
        populate: {
          path: "courseTemplate",
          select: "name code",
        },
      });

    const subjects = results.map((r) => ({
      subject: r.courseInstance?.courseTemplate?.name || "N/A",
      semester1: r.semester1?.total || 0,
      semester2: r.semester2?.total || 0,
      finalAverage: r.yearFinalScore || 0,
    }));

    // totals
    const sem1Total = subjects.reduce((sum, s) => sum + s.semester1, 0);
    const sem2Total = subjects.reduce((sum, s) => sum + s.semester2, 0);
    const finalTotal = subjects.reduce((sum, s) => sum + s.finalAverage, 0);

    const subjectCount = subjects.length || 1;

    const sem1Average = sem1Total / subjectCount;
    const sem2Average = sem2Total / subjectCount;
    const finalAverage = finalTotal / subjectCount;

    res.json({
      student: {
        name: student.name,
        grade: classRoom?.grade || "N/A",
        section: classRoom?.section || "",
      },
      subjects,
      totals: {
        semester1Total: sem1Total,
        semester2Total: sem2Total,
        finalYearTotal: finalTotal,
        semester1Average: sem1Average,
        semester2Average: sem2Average,
        finalYearAverage: finalAverage,
      },
      overallAverage: finalAverage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};