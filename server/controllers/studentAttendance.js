import AttendanceRecord from "../models/AttendanceRecord.js";
import mongoose from "mongoose";
import AttendanceSession from "../models/AttendanceSession.js";
export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { academicYear, sessionType } = req.query;

    if (!studentId) {
      return res.status(400).json({ message: "Student not authenticated" });
    }

    /* ===============================
       Build Session Filter (Dynamic)
    =============================== */

    const sessionFilters = {};

    if (academicYear) {
      sessionFilters["session.academicYear"] = academicYear;
    }

    if (sessionType) {
      sessionFilters["session.sessionType"] = sessionType;
    }

    /* ===============================
       Aggregation Pipeline
    =============================== */

    const pipeline = [
      // 1️⃣ Match Student
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
        },
      },

      // 2️⃣ Join AttendanceSession
      {
        $lookup: {
          from: "attendancesessions", // must match collection name exactly
          localField: "attendanceSession",
          foreignField: "_id",
          as: "session",
        },
      },

      { $unwind: "$session" },
    ];

    // 3️⃣ Apply session filters only if they exist
    if (Object.keys(sessionFilters).length > 0) {
      pipeline.push({ $match: sessionFilters });
    }

    // 4️⃣ Sort latest first
    pipeline.push({
      $sort: { "session.sessionDate": -1 },
    });

    // 5️⃣ Project clean output
    pipeline.push({
      $project: {
        _id: 1,
        date: "$session.sessionDate",
        type: "$session.sessionType",
        period: "$session.periodNumber",
        status: 1,
        remark: 1,
      },
    });

    const records = await AttendanceRecord.aggregate(pipeline);

    /* ===============================
       Summary Calculation
    =============================== */

    let total = records.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let excused = 0;

    records.forEach((r) => {
      switch (r.status?.toUpperCase()) {
        case "PRESENT":
          present++;
          break;
        case "ABSENT":
          absent++;
          break;
        case "LATE":
          late++;
          break;
        case "EXCUSED":
          excused++;
          break;
        default:
          break;
      }
    });

    const percentage =
      total === 0
        ? 0
        : Number((((present + late) / total) * 100).toFixed(1));

    /* ===============================
       Response
    =============================== */

    res.json({
      summary: {
        total,
        present,
        absent,
        late,
        excused,
        percentage,
      },
      records,
    });
  } catch (error) {
    console.error("Student Attendance Error:", error);
    res.status(500).json({
      message: "Failed to fetch attendance",
    });
  }
};


export const getAcademicYears = async (req, res) => {
  try {
    const years = await AttendanceSession.distinct("academicYear");
    res.json(years);
  } catch (error) {
    console.error("Academic Years Error:", error);
    res.status(500).json({ message: "Failed to fetch academic years" });
  }
};