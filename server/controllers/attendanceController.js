import mongoose from "mongoose";
import AttendanceSession from "../models/AttendanceSession.js";
import AttendanceRecord from "../models/AttendanceRecord.js";
export const createAttendanceSession = async (req, res) => {
  try {
    const {
      classId,
      courseInstanceId,
      sessionDate,
      sessionType,
      periodNumber,
      academicYearId
    } = req.body;

    const session = await AttendanceSession.create({
      class: classId,
      courseInstance: courseInstanceId || null,
      sessionDate,
      sessionType,
      periodNumber: periodNumber || null,
      academicYear: academicYearId,
      createdBy: req.user._id
    });
 
    res.status(201).json(session);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const submitAttendanceRecords = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { records } = req.body;

    const bulkOps = records.map((r) => {
      // Create a clean update object
      const updateData = {
        status: r.status,
      };

      // Only add remark if it's actually provided, otherwise set to null
      // to avoid conflict errors during upsert
      updateData.remark = r.remark || null;

      return {
        updateOne: {
          filter: {
            attendanceSession: sessionId,
            student: r.student, // Ensure this matches your frontend key
          },
          update: { $set: updateData }, // Use $set explicitly
          upsert: true,
        },
      };
    });

    await AttendanceRecord.bulkWrite(bulkOps);

    res.json({ message: "Attendance recorded successfully" });
  } catch (error) {
    console.error("BulkWrite Error:", error);
    res.status(400).json({ message: error.message });
  }
};


export const getStudentAttendanceSummary = async (req, res) => {
  try {
    const { studentId } = req.params;

    const summary = await AttendanceRecord.aggregate([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId)
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getClassAttendanceByDate = async (req, res) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    // Normalize date to prevent timestamp mismatches
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const session = await AttendanceSession.findOne({
      class: classId,
      sessionDate: { $gte: startOfDay, $lte: endOfDay },
      sessionType: "DAILY"
    });

    // CRITICAL: Return session: null instead of 404
    if (!session) {
      return res.status(200).json({ session: null, records: [] });
    }

    const records = await AttendanceRecord.find({
      attendanceSession: session._id
    }).populate("student");

    res.json({ session, records });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getMonthlyAttendanceReport = async (req, res) => {
  try {
    const { classId } = req.params;
    const { month } = req.query; // format: 2026-02

    if (!month) {
      return res.status(400).json({ message: "Month is required" });
    }

    // Create month range
    const startDate = new Date(`${month}-01`);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    // 1️⃣ Get all DAILY sessions for this class in that month
    const sessions = await AttendanceSession.find({
      class: classId,
      sessionType: "DAILY",
      sessionDate: { $gte: startDate, $lt: endDate }
    });

    const sessionIds = sessions.map((s) => s._id);

    const totalDays = sessions.length;

    if (sessionIds.length === 0) {
      return res.json({
        totalDays: 0,
        students: []
      });
    }

    // 2️⃣ Get all records for those sessions
    const records = await AttendanceRecord.find({
      attendanceSession: { $in: sessionIds }
    }).populate("student", "name");

    // 3️⃣ Aggregate manually
    const reportMap = {};

    records.forEach((record) => {
      const studentId = record.student._id.toString();

      if (!reportMap[studentId]) {
        reportMap[studentId] = {
          _id: studentId,
          name: record.student.name,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0
        };
      }

      const status = record.status;

      if (status === "PRESENT") reportMap[studentId].present++;
      if (status === "ABSENT") reportMap[studentId].absent++;
      if (status === "LATE") reportMap[studentId].late++;
      if (status === "EXCUSED") reportMap[studentId].excused++;
    });

    res.json({
      totalDays,
      students: Object.values(reportMap)
    });

  } catch (error) {
    console.error("Monthly Report Error:", error);
    res.status(500).json({ message: error.message });
  }
};