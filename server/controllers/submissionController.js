import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
const submitAssignment = async (req, res) => {
  try {
    const { id } = req.params; // assignmentId

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Prevent duplicate submission
    const existing = await Submission.findOne({
      assignment: id,
      student: req.user.id
    });

    if (existing) {
      return res.status(400).json({ message: "Already submitted" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const isLate = new Date() > assignment.dueDate;

    const submission = await Submission.create({
      assignment: id,
      student: req.user.id,
      fileUrl: req.file.path,
      isLate
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const submissions = await Submission.find({ assignment: assignmentId })
      .populate("student", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const gradeSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { marks, feedback } = req.body;

    const submission = await Submission.findById(submissionId)
      .populate("assignment");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (submission.assignment.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    submission.marks = marks;
    submission.feedback = feedback;
    submission.status = "graded";

    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Add this to submissionController.js
const getStudentSubmissions = async (req, res) => {
  try {
    // Find all submissions where the student field matches the logged-in user's ID
    const submissions = await Submission.find({ student: req.user.id })
      .populate("assignment", "title dueDate") // Optional: brings in assignment details
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update your export statement at the bottom
export {
  submitAssignment,
  getSubmissionsByAssignment,
  gradeSubmission,
  getStudentSubmissions // Add this
};

