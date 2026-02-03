import Enrollment from "../models/Enrollment.js";

// Enroll a student into a course
export const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.body;

    const newEnroll = await Enrollment.create({
      course: courseId,
      student: req.user._id,
    });

    res.status(201).json(newEnroll);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }
    res.status(500).json({ message: error.message });
  }
};

// Get all students enrolled in a course (Teacher/Admin)
export const getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course: req.params.courseId })
      .populate("student", "name email");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all courses a student is enrolled in
export const getStudentEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate("course", "title description category");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
