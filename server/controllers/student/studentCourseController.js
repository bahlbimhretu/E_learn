import CourseInstance from "../../models/CourseInstance.js";

export const getStudentCourseInstances = async (req, res) => {
  try {
    const student = req.user;

    if (!student.studentProfile) {
      return res.status(400).json({ message: "Student profile not found" });
    }

    const { grade, section, academicYear } = student.studentProfile;

    if (!grade || !section || !academicYear) {
      return res.status(400).json({
        message: "Incomplete student profile (grade, section, academicYear required)",
      });
    }

    const courses = await CourseInstance.find({
      grade,
      section,
      academicYear,
      status: "active",
    })
      .populate({
        path: "courseTemplate",
        // 🔴 CHANGE HERE ONLY
        select: "name thumbnail description",
      })
      .populate({
        path: "teacher",
        select: "name",
      })
      .sort({ createdAt: -1 });

    const formattedCourses = courses.map((course) => ({
      _id: course._id,
      grade: course.grade,
      section: course.section,
      academicYear: course.academicYear,

      // 🔴 CHANGE HERE ONLY
      courseName: course.courseTemplate?.name,
      thumbnail: course.courseTemplate?.thumbnail, // UNCHANGED
      teacherName: course.teacher?.name || "Unknown",

      createdAt: course.createdAt,
    }));

    res.json(formattedCourses);
  } catch (error) {
    console.error("Error fetching student course instances:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentCourseInstanceById = async (req, res) => {
  try {
    const student = req.user;
    const { id } = req.params;

    const { grade, section, academicYear } = student.studentProfile || {};

    if (!grade || !section || !academicYear) {
      return res.status(400).json({ message: "Incomplete student profile" });
    }

    const course = await CourseInstance.findOne({
      _id: id,
      grade,
      section,
      academicYear,
      status: "active",
    })
      .populate({
        path: "courseTemplate",
        // 🔴 CHANGE HERE ONLY
        select: "name thumbnail description",
      })
      .populate({
        path: "teacher",
        select: "name",
      });

    if (!course) {
      return res.status(404).json({
        message: "Course not found or access denied",
      });
    }

    res.json({
      _id: course._id,
      // 🔴 CHANGE HERE ONLY
      courseName: course.courseTemplate?.name,
      description: course.courseTemplate?.description,
      thumbnail: course.courseTemplate?.thumbnail, // UNCHANGED
      teacherName: course.teacher?.name,
      grade: course.grade,
      section: course.section,
      academicYear: course.academicYear,
    });
  } catch (error) {
    console.error("Student course fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
