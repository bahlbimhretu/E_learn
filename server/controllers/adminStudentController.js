import mongoose from "mongoose";
import User from "../models/Users.js";
import ClassRoom from "../models/ClassRoom.js";

/**
 * GET /admin/students
 * Supports:
 * - classRoom (recommended)
 * - grade + section (fallback)
 * - search
 * - pagination
 */
export const getStudents = async (req, res) => {
  try {
    const {
      classRoom,
      grade,
      section,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      role: "student",
    };

    // ✅ PRIORITY: Filter by ClassRoom
    if (classRoom) {
      if (!mongoose.Types.ObjectId.isValid(classRoom)) {
        return res.status(400).json({ message: "Invalid ClassRoom ID" });
      }

      query["studentProfile.classRoom"] = classRoom;
    }
    // ✅ FALLBACK: grade + section
    else if (grade) {
      query["studentProfile.grade"] = grade;
      if (section) {
        query["studentProfile.section"] = section;
      }
    }

    // 🔎 Search by student name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [students, total] = await Promise.all([
      User.find(query)
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .populate({
          path: "studentProfile.guardian",
          select: "name email parentProfile.phone",
        })
        .populate({
          path: "studentProfile.classRoom",
          select: "academicYear grade section",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      User.countDocuments(query),
    ]);

    res.json({
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
      students,
    });
  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /admin/students/:id
 */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || id === "undefined") {
      return res.status(400).json({ message: "Student ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Student ID format" });
    }

    const student = await User.findOne({
      _id: id,
      role: "student",
    })
      .select("-password -resetPasswordToken -resetPasswordExpire")
      .populate({
        path: "studentProfile.guardian",
        select: "name email parentProfile.phone",
      })
      .populate({
        path: "studentProfile.classRoom",
        select: "academicYear grade section homeRoomTeacher",
        populate: {
          path: "homeRoomTeacher",
          select: "name email",
        },
      });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("GET STUDENT BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /admin/students/:id/status
 */
export const updateStudentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["active", "inactive", "suspended", "graduated"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Student ID" });
    }

    const student = await User.findOneAndUpdate(
      { _id: id, role: "student" },
      { status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student status updated successfully",
      status: student.status,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};