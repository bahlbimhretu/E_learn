import User from "../models/Users.js";

/**
 * GET /admin/students
 */
export const getStudents = async (req, res) => {
  try {
    const {
      grade,
      section,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    if (!grade) {
      return res.status(400).json({ message: "Grade is required" });
    }

    const query = {
      role: "student",
      "studentProfile.grade": grade,
    };

    if (section) {
      query["studentProfile.section"] = section;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [students, total] = await Promise.all([
      User.find(query)
        .select("-password -resetPasswordToken -resetPasswordExpire")
        .populate({
          path: "studentProfile.guardian",
          select: "name parentProfile.phone",
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
import mongoose from "mongoose";

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🚨 HARD STOP
    if (!id || id === "undefined") {
      return res.status(400).json({
        message: "Student ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Student ID format",
      });
    }

    const student = await User.findById(id)
  .populate({
    path: "studentProfile.guardian",
    select: "name email parentProfile.phone",
  });


    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
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
    const { status } = req.body;

    const allowed = ["active", "inactive", "suspended", "graduated"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.id, role: "student" },
      { status },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      message: "Student status updated",
      status: student.status,
    });
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
