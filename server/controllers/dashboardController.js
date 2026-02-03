// server/controllers/dashboardController.js
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Material from "../models/Material.js";
import Lesson from "../models/Lesson.js";
import User from "../models/Users.js";
import CourseInstance from "../models/CourseInstance.js";

/**
 * GET /api/dashboard/student
 * protected -> student (any logged-in user)
 */
export const getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user._id;

    // totals
    const totalCourses = await Course.countDocuments();
    const enrolledCount = await Enrollment.countDocuments({ student: studentId });

    // Get the list of course ids student is enrolled in
    const enrollments = await Enrollment.find({ student: studentId }).select("course");
    const enrolledCourseIds = enrollments.map((e) => e.course);

    // Count materials for student's enrolled courses (or all materials if not enrolled in any)
    const materials = enrolledCourseIds.length
      ? await Material.countDocuments({ course: { $in: enrolledCourseIds } })
      : 0;

    // Count lessons in enrolled courses as proxy for "lessons"/"content"
    const lessons = enrolledCourseIds.length
      ? await Lesson.countDocuments({ course: { $in: enrolledCourseIds } })
      : 0;

    // Recent courses (global recent)
    const recentCourses = await Course.find().sort({ createdAt: -1 }).limit(3).select("title _id");

    res.json({
      totalCourses,
      enrolled: enrolledCount,
      materials,
      lessons,
      recentCourses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET /api/dashboard/teacher
 * protected -> teacher or admin
 */
export const getTeacherDashboardStats = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // 1️⃣ Teacher's active course instances
    const courseInstances = await CourseInstance.find({
      teacher: teacherId,
      status: "active",
    })
      .populate("courseTemplate", "title subject thumbnail")
      .select("courseTemplate grade section academicYear students createdAt")
      .sort({ createdAt: -1 });

    const classesCount = courseInstances.length;

    // 2️⃣ Lessons uploaded by this teacher
    const lessonsCount = await Lesson.countDocuments({
      createdBy: teacherId,
    });

    // 3️⃣ Unique students across all teacher classes
    const studentSet = new Set();

    courseInstances.forEach((ci) => {
      ci.students.forEach((studentId) => {
        studentSet.add(studentId.toString());
      });
    });

    const activeStudents = studentSet.size;

    // 4️⃣ Recent classes (latest 3)
    const recentCourses = courseInstances.slice(0, 3).map((ci) => ({
      _id: ci._id,
      title: ci.courseTemplate?.title,
      subject: ci.courseTemplate?.subject,
      grade: ci.grade,
      section: ci.section,
      academicYear: ci.academicYear,
      thumbnail: ci.courseTemplate?.thumbnail,
    }));

    res.json({
      classesCount,
      lessonsCount,
      activeStudents,
      recentCourses,
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
