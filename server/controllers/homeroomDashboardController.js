import ClassRoom from "../models/ClassRoom.js";
import CourseInstance from "../models/CourseInstance.js";
import Lesson from "../models/Lesson.js";
import User from "../models/Users.js";
import { Announcement } from "../models/Announcement.js";

/**
 * GET /api/dashboard/homeroom
 * protected -> teacher (must be assigned as homeroom)
 */
export const getHomeroomDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1️⃣ Find ClassRoom where this teacher is homeroom
    const classRoom = await ClassRoom.findOne({
      homeRoomTeacher: teacherId,
      status: "active",
    });

    if (!classRoom) {
      return res.status(404).json({ message: "No homeroom class assigned." });
    }

    // 2️⃣ Get students in this class
    const students = await User.find({
      role: "student",
      status: "active",
      "studentProfile.classRoom": classRoom._id,
    }).select("name email");

    const totalStudents = students.length;

    // 3️⃣ Get course instances for this class
    const courseInstances = await CourseInstance.find({
      classRoom: classRoom._id,
      status: "active",
    }).select("_id");

    const courseIds = courseInstances.map(c => c._id);

    // 4️⃣ Count lessons across all courses of this class
    const lessonsCount = await Lesson.countDocuments({
      courseInstance: { $in: courseIds },
    });

    // 5️⃣ Recent announcements (from all courses of this class)
    const recentAnnouncements = await Announcement.find({
      courseInstance: { $in: courseIds },
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("title createdAt");

    res.json({
      classInfo: {
        grade: classRoom.grade,
        section: classRoom.section,
        academicYear: classRoom.academicYear,
      },
      totalStudents,
      totalCourses: courseInstances.length,
      lessonsCount,
      recentAnnouncements,
    });
  } catch (err) {
    console.error("Homeroom dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};