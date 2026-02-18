import User from "../models/Users.js";
import Result from "../models/Result.js";
import CourseInstance from "../models/CourseInstance.js";

export const getMyChildren = async (req, res) => {
  try {
    const parent = await User.findById(req.user._id)
      .populate({
        path: "parentProfile.children",
        select: "name studentProfile.grade studentProfile.section status",
      });

    if (!parent || parent.role !== "parent") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(parent.parentProfile.children || []);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getChildOverview = async (req, res) => {
  try {
    const { childId } = req.params;

    // 🔐 Verify child belongs to parent
    const parent = await User.findById(req.user._id);

    if (!parent.parentProfile.children.includes(childId)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    // 🔹 Get results
    const results = await Result.find({ student: childId });

    let overallAverage = 0;

    if (results.length > 0) {
      const total = results.reduce(
        (sum, r) => sum + (r.yearFinalScore || 0),
        0
      );
      overallAverage = total / results.length;
    }

    // 🔹 Get enrolled courses
    const enrolledCourses = await CourseInstance.countDocuments({
      students: childId,
      status: "active",
    });

    res.json({
      overallAverage: Number(overallAverage.toFixed(2)),
      enrolledCourses,
      subjectsCount: results.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const getChildPerformance = async (req, res) => {
  try {
    const { childId } = req.params;

    const parent = await User.findById(req.user._id);

    if (!parent.parentProfile.children.includes(childId)) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    const results = await Result.find({ student: childId })
      .populate({
        path: "courseInstance",
        populate: { path: "courseTemplate", select: "name" },
      });

    const formatted = results.map((r) => ({
      subject: r.courseInstance.courseTemplate.name,
      semester1: r.semester1.total,
      semester2: r.semester2.total,
      finalScore: r.yearFinalScore,
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
