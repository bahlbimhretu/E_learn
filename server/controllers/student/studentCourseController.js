import CourseInstance from "../../models/CourseInstance.js";


export const getStudentCourseInstances = async (req, res) => {
  try {
    const student = req.user;

    const courses = await CourseInstance.find({
      students: student._id, // 🔥 KEY FIX
    })
      .populate({
        path: "courseTemplate",
        select: "name thumbnail description",
      })
      .populate({
        path: "teacher",
        select: "name",
      })
      .sort({ academicYear: -1, createdAt: -1 });

    const formattedCourses = courses.map((course) => ({
      _id: course._id,
      grade: course.grade,
      section: course.section,
      academicYear: course.academicYear,
      courseName: course.courseTemplate?.name,
      thumbnail: course.courseTemplate?.thumbnail,
      teacherName: course.teacher?.name || "Unknown",
      status: course.status, // 🔥 important
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

    const course = await CourseInstance.findOne({
      _id: id,
      students: student._id, // 🔥 KEY FIX
    })
      .populate({
        path: "courseTemplate",
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
      courseName: course.courseTemplate?.name,
      description: course.courseTemplate?.description,
      thumbnail: course.courseTemplate?.thumbnail,
      teacherName: course.teacher?.name || "Unknown",
      grade: course.grade,
      section: course.section,
      academicYear: course.academicYear,
      status: course.status, // 🔥 important
    });
  } catch (error) {
    console.error("Student course fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};