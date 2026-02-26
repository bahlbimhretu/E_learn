// server/controllers/dashboardController.js
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Material from "../models/Material.js";
import Lesson from "../models/Lesson.js";
import User from "../models/Users.js";
import CourseInstance from "../models/CourseInstance.js";
import ClassRoom from "../models/ClassRoom.js";

/**
 * GET /api/dashboard/student
 * protected -> student (any logged-in user)
 */


// Add this to your imports at the top
import { Announcement } from "../models/Announcement.js"; 

export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    // 1. Find instances where student is enrolled
    const enrolledInstances = await CourseInstance.find({ 
      students: studentId 
    }).select("_id");

    const enrolledInstanceIds = enrolledInstances.map((inst) => inst._id);

    // 2. Run counts and fetch recent announcements in parallel
    const [totalCourses, materials, lessons, recentAnnouncements] = await Promise.all([
      CourseInstance.countDocuments({ status: "active" }),
      
      enrolledInstanceIds.length 
        ? Material.countDocuments({ course: { $in: enrolledInstanceIds } }) 
        : 0,
        
      enrolledInstanceIds.length 
        ? Lesson.countDocuments({ course: { $in: enrolledInstanceIds } }) 
        : 0,

      // Fetching the 3 most recent published announcements for students
      Announcement.find({ 
        status: "published", 
        "audience.roles": "student",
        isArchived: false 
      })
        .sort({ createdAt: -1 })
        .limit(3)
        .select("title createdAt") // Only grab what the frontend needs
    ]);

    // 3. Return the data
    res.json({
      totalCourses,
      enrolled: enrolledInstanceIds.length,
      materials,
      lessons,
      recentAnnouncements, // Replaces recentCourses
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ message: "Error loading dashboard data" });
  }
};
/**
 * import ClassRoom from "../models/ClassRoom.js";
import CourseInstance from "../models/CourseInstance.js";
import Lesson from "../models/Lesson.js";
import User from "../models/Users.js";

/**
 * GET /api/dashboard/teacher
 * protected -> teacher
 */
export const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // ===============================
    // 1️⃣ SUBJECT TEACHER DATA
    // ===============================

    const courseInstances = await CourseInstance.find({
      teacher: teacherId,
      status: "active",
    })
      .populate("courseTemplate", "title subject thumbnail")
      .select("courseTemplate grade section academicYear students createdAt")
      .sort({ createdAt: -1 });

    const classesCount = courseInstances.length;

    const lessonsCount = await Lesson.countDocuments({
      createdBy: teacherId,
    });

    // Count unique students
    const studentSet = new Set();
    courseInstances.forEach((ci) => {
      ci.students.forEach((studentId) => {
        studentSet.add(studentId.toString());
      });
    });

    const activeStudents = studentSet.size;

    const recentCourses = courseInstances.slice(0, 3).map((ci) => ({
      _id: ci._id,
      title: ci.courseTemplate?.title,
      subject: ci.courseTemplate?.subject,
      grade: ci.grade,
      section: ci.section,
      academicYear: ci.academicYear,
      thumbnail: ci.courseTemplate?.thumbnail,
    }));

    // ===============================
    // 2️⃣ HOMEROOM DATA (MERGED)
    // ===============================

    const classRoom = await ClassRoom.findOne({
      homeRoomTeacher: teacherId,
      status: "active",
    });

    let homeroom = { isHomeroom: false };

    if (classRoom) {
      // Get students in homeroom
      const students = await User.find({
        role: "student",
        status: "active",
        "studentProfile.classRoom": classRoom._id,
      }).select("_id");

      const studentsCount = students.length;

      // Get all course instances of this class
      const classCourses = await CourseInstance.find({
        classRoom: classRoom._id,
        status: "active",
      }).select("_id");

      const courseIds = classCourses.map((c) => c._id);

      const totalLessons = await Lesson.countDocuments({
        courseInstance: { $in: courseIds },
      });

      homeroom = {
  isHomeroom: true,
  classInfo: {
  _id: classRoom._id,   // ← THIS IS WHAT IS MISSING
  grade: classRoom.grade,
  section: classRoom.section,
  academicYear: classRoom.academicYear,
  studentsCount,
},


        totalCourses: classCourses.length,
        lessonsCount: totalLessons,
        attendanceRate: 0, // add real calculation later
        lowPerformers: 0,  // add real calculation later
      };
    }

    // ===============================
    // FINAL RESPONSE
    // ===============================

    res.json({
      classesCount,
      lessonsCount,
      activeStudents,
      recentCourses,
      homeroom, // 🔥 THIS FIXES YOUR ISSUE
    });

  } catch (err) {
    console.error("Teacher dashboard error:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET /api/dashboard/admin
 * protected -> admin
 */
export const getAdminDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const activeTeachers = await User.countDocuments({ role: "teacher" });

    res.json({
      totalUsers,
      totalCourses,
      activeTeachers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/dashboard/library
 * protected -> library-admin or admin
 */
export const getLibraryDashboardStats = async (req, res) => {
  try {
    const totalMaterials = await Material.countDocuments();

    // uploaded this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const uploadedThisWeek = await Material.countDocuments({ createdAt: { $gte: weekAgo } });

    // number uploaded by this library-admin
    const uploadedByMe = await Material.countDocuments({ uploadedBy: req.user._id });

    res.json({
      totalMaterials,
      uploadedThisWeek,
      uploadedByMe,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
