import AttendanceSession from "../models/AttendanceSession.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
import Classroom from "../models/ClassRoom.js";
import mongoose from "mongoose";

export const getHomeroomDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1️⃣ Find class where teacher is homeroom
    const homeroomClass = await Classroom.findOne({
      homeRoomTeacher: teacherId,
      status: "active"
    }).populate("students", "_id name");

    if (!homeroomClass) {
      return res.json({ isHomeroom: false });
    }

    const classId = homeroomClass._id;
    const students = homeroomClass.students;
    const studentsCount = students.length;

    // ===== TODAY ATTENDANCE =====
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const todaySession = await AttendanceSession.findOne({
      class: classId,
      sessionType: "DAILY",
      sessionDate: { $gte: today, $lte: endOfDay }
    });

    let todayAttendanceTaken = false;
    let todayPresentCount = 0;
    let todayAbsentCount = 0;

    if (todaySession) {
      todayAttendanceTaken = true;

      const todayRecords = await AttendanceRecord.find({
        attendanceSession: todaySession._id
      });

      todayRecords.forEach((r) => {
        if (r.status === "PRESENT") todayPresentCount++;
        if (r.status === "ABSENT") todayAbsentCount++;
      });
    }

    // ===== MONTHLY ATTENDANCE RATE =====
    const now = new Date();
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const monthSessions = await AttendanceSession.find({
      class: classId,
      sessionType: "DAILY",
      sessionDate: { $gte: startMonth, $lte: endMonth }
    });

    const sessionIds = monthSessions.map(s => s._id);

    const monthRecords = await AttendanceRecord.find({
      attendanceSession: { $in: sessionIds }
    });

    let totalPossible = studentsCount * monthSessions.length;
    let totalPresent = monthRecords.filter(r => r.status === "PRESENT").length;

    const attendanceRate =
      totalPossible > 0
        ? ((totalPresent / totalPossible) * 100).toFixed(1)
        : 0;

    // ===== LOW PERFORMERS (< 75%) =====
    const studentMap = {};

    monthRecords.forEach((r) => {
      const id = r.student.toString();
      if (!studentMap[id]) {
        studentMap[id] = { present: 0 };
      }
      if (r.status === "PRESENT") {
        studentMap[id].present++;
      }
    });

    let lowPerformers = 0;

    Object.keys(studentMap).forEach((id) => {
      const present = studentMap[id].present;
      const percent =
        monthSessions.length > 0
          ? (present / monthSessions.length) * 100
          : 100;

      if (percent < 75) lowPerformers++;
    });

    res.json({
      isHomeroom: true,
      classInfo: {
        _id: homeroomClass._id,
        grade: homeroomClass.grade,
        section: homeroomClass.section,
        academicYear: homeroomClass.academicYear,
        studentsCount
      },
      attendanceRate,
      lowPerformers,
      todayAttendanceTaken,
      todayPresentCount,
      todayAbsentCount
    });

  } catch (error) {
    console.error("Homeroom Dashboard Error:", error);
    res.status(500).json({ message: error.message });
  }
};