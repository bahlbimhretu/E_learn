import CourseInstance from "../models/CourseInstance.js";
import CourseTemplate from "../models/CourseTemplate.js";
import User from "../models/Users.js";

export const createCourseInstance = async (req, res) => {
  try {
    const {
      courseTemplateId,
      academicYear,
      grade,
      section,
      teacherId,
    } = req.body;

    if (!courseTemplateId || !academicYear || !grade || !section) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const template = await CourseTemplate.findById(courseTemplateId);
    if (!template) {
      return res.status(404).json({ message: "Course template not found" });
    }

    // 🔹 Find matching students
    const students = await User.find({
      role: "student",
      status: "active",
      "studentProfile.grade": grade,
      "studentProfile.section": section,
      "studentProfile.academicYear": academicYear,
    }).select("_id");

    // 🔹 Create OR update instance
    const instance = await CourseInstance.findOneAndUpdate(
      {
        courseTemplate: courseTemplateId,
        academicYear,
        grade,
        section,
      },
      {
        $setOnInsert: {
          teacher: teacherId || null,
          createdBy: req.user._id,
          status: "active",
        },
        $addToSet: {
          students: { $each: students.map((s) => s._id) },
        },
      },
      {
        new: true,
        upsert: true,
      }
    );

    res.status(201).json(instance);
  } catch (error) {
    console.error("CREATE COURSE INSTANCE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCourseInstances = async (req, res) => {
  try {
    const instances = await CourseInstance.find()
      .populate("courseTemplate", "name code thumbnail category")
      .populate("teacher", "name email")
      .sort({ createdAt: -1 });

    res.json(instances);
  } catch (error) {
    console.error("GET COURSE INSTANCES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const assignTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { teacherId } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    const instance = await CourseInstance.findByIdAndUpdate(
      id,
      { teacher: teacherId },
      { new: true }
    );

    if (!instance) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    res.json(instance);
  } catch (error) {
    console.error("ASSIGN TEACHER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const archiveCourseInstance = async (req, res) => {
  try {
    const instance = await CourseInstance.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );

    if (!instance) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    res.json(instance);
  } catch (error) {
    console.error("ARCHIVE COURSE INSTANCE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// get course instance by id
export const getCourseInstanceById = async (req, res) => {
  try {
    const instance = await CourseInstance.findById(req.params.id)
      .populate("courseTemplate", "name code description")
      .populate("teacher", "name email")
      .populate("students", "name email studentProfile");

    if (!instance) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    res.json(instance);
  } catch (error) {
    console.error("GET COURSE INSTANCE BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// update course instance

export const updateCourseInstance = async (req, res) => {
  try {
    const {
      courseTemplateId,
      academicYear,
      grade,
      section,
      teacherId,
    } = req.body;

    const instance = await CourseInstance.findById(req.params.id);
    if (!instance) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    instance.courseTemplate = courseTemplateId;
    instance.academicYear = academicYear;
    instance.grade = grade;
    instance.section = section;
    instance.teacher = teacherId || null;

    await instance.save();
    res.json(instance);
  } catch (error) {
    console.error("UPDATE COURSE INSTANCE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// controllers/adminCourseInstanceController.js

export const restoreCourseInstance = async (req, res) => {
  try {
    const instance = await CourseInstance.findById(req.params.id);

    if (!instance) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    instance.status = "active";
    await instance.save();

    res.json(instance);
  } catch (error) {
    console.error("RESTORE COURSE INSTANCE ERROR:", error);
    res.status(500).json({ message: "Failed to restore course instance" });
  }
};



