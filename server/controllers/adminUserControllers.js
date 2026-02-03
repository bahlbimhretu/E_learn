import User from "../models/Users.js";
import CourseInstance from "../models/CourseInstance.js";
export const getStudents = async (req, res) => {
  try {
    const {
      grade,
      section,
      search = "",
      page = 1,
      limit = 10,
    } = req.query;

    if (!grade) {
      return res.status(400).json({ message: "Grade is required" });
    }

    /* ---------------- FILTER ---------------- */
    const filter = {
      role: "student",
      "studentProfile.grade": grade,
    };

    if (section) {
      filter["studentProfile.section"] = section;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    /* ---------------- PAGINATION ---------------- */
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      User.find(filter)
        .populate("studentProfile.guardian", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      User.countDocuments(filter),
    ]);

    /* ---------------- SHAPE RESPONSE FOR UI ---------------- */
    const formattedStudents = students.map((s) => ({
      _id: s._id,
      name: s.name,
      status: "active", // you can make this dynamic later
      grade: { name: s.studentProfile.grade },
      section: { name: s.studentProfile.section },
      parent: s.studentProfile.guardian
        ? { name: s.studentProfile.guardian.name }
        : null,
    }));

    res.json({
      students: formattedStudents,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get students error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/adminTeachersController.js
export const getTeachers = async (req, res) => {
  try {
    // 1. Get all teachers from Users collection
    const teachers = await User.find({ role: "teacher" })
      .select("name status teacherProfile");

    // 2. Get all course instances with teacher + courseTemplate populated
    const courseInstances = await CourseInstance.find()
  .populate("teacher", "_id")
  .populate("courseTemplate", "name"); // ✅ use "name" instead of "title"


    // 3. Build a map of teacherId -> assignedCourses
    const teacherCoursesMap = {};
    courseInstances.forEach((ci) => {
      if (ci.teacher) {
        const tId = ci.teacher._id.toString();
        if (!teacherCoursesMap[tId]) teacherCoursesMap[tId] = [];
        teacherCoursesMap[tId].push({
  title: ci.courseTemplate?.name || "Untitled", // ✅ use name
  grade: ci.grade,
  section: ci.section,
});

      }
    });

    // 4. Merge teachers with their assigned courses
    const result = teachers.map((t) => ({
      _id: t._id,
      name: t.name,
      status: t.status,
      teacherProfile: t.teacherProfile,
      assignedCourses: teacherCoursesMap[t._id.toString()] || [],
    }));

    res.json(result);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: err.message });
  }
};
