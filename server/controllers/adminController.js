import User from "../models/Users.js";
import Course from "../models/Course.js";
import Lesson from "../models/Lesson.js";
import Material from "../models/Material.js";
import Enrollment from "../models/Enrollment.js";
import Grade from "../models/Grade.js";


import bcrypt from "bcryptjs";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) return res.status(400).json({ message: "Email already used" });

    const newUser = await User.create({ name, email, password, role });

    res.status(201).json({
      message: "User created successfully",
      user: { _id: newUser._id, name, email, role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/adminController.js
export const getGrades = async (req, res) => {
  const grades = await Grade.find().sort({ name: 1 });
  res.json(grades);
};
export const getSectionsByGrade = async (req, res) => {
  const { gradeId } = req.query;

  const sections = await Section.find({ grade: gradeId });
  res.json(sections);
};

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const teachers = await User.countDocuments({ role: "teacher" });
    const students = await User.countDocuments({ role: "student" });
    

    const totalCourses = await Course.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalMaterials = await Material.countDocuments();
    const enrollments = await Enrollment.countDocuments();

    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password");

    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("createdBy", "name email");

    res.json({
      users: {
        total: totalUsers,
        teachers,
        students,
        
      },
      courses: {
        total: totalCourses,
        totalLessons,
        totalMaterials,
      },
      enrollments,
      recentUsers,
      recentCourses,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
