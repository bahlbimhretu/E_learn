import Assignment from "../models/Assignment.js";
import Lesson from "../models/Lesson.js";   

// CREATE ASSIGNMENT (Teacher)
const createAssignment = async (req, res) => {
  try {
    const { title, description, lessonId, dueDate, totalMarks } = req.body;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const assignment = await Assignment.create({
      title,
      description,
      lesson: lesson._id,
      course: lesson.course,
      teacher: req.user.id,
      dueDate,
      totalMarks,
      fileUrl: req.file ? req.file.path : null
    });

    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET ASSIGNMENTS BY LESSON (Teacher or Student)
const getAssignmentsByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const assignments = await Assignment.find({ lesson: lessonId })
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// DELETE ASSIGNMENT (Only Creator Teacher)
const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await assignment.deleteOne();

    res.json({ message: "Assignment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export {
  createAssignment,
  getAssignmentsByLesson,
  deleteAssignment
};
