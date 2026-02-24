import CourseInstance from "../models/CourseInstance.js";
import CourseTemplate from "../models/CourseTemplate.js";
import User from "../models/Users.js"
import ClassRoom from "../models/ClassRoom.js";

export const createCourseInstance = async (req, res) => {
  try {
    const { courseTemplateId, academicYear, classRoomId, teacherId } = req.body;

    if (!courseTemplateId || !academicYear || !classRoomId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const template = await CourseTemplate.findById(courseTemplateId);
    if (!template) {
      return res.status(404).json({ message: "Course template not found" });
    }

    const classRoom = await ClassRoom.findById(classRoomId);
    if (!classRoom) {
      return res.status(404).json({ message: "ClassRoom not found" });
    }

    // ✅ get students from classroom
    const students = await User.find({
      role: "student",
      status: "active",
      "studentProfile.classRoom": classRoomId,
    }).select("_id");

    // ✅ prevent duplicate instance
    const existing = await CourseInstance.findOne({
      courseTemplate: courseTemplateId,
      classRoom: classRoomId,
      academicYear,
    });

    if (existing) {
      return res.status(400).json({
        message: "Course instance already exists for this class",
      });
    }

    const instance = await CourseInstance.create({
      courseTemplate: courseTemplateId,
      academicYear,
      classRoom: classRoomId,
      teacher: teacherId || null,
      grade: classRoom.grade,
      section: classRoom.section,
      students: students.map((s) => s._id),
      createdBy: req.user._id,
      status: "active",
    });

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
      .populate("classRoom", "grade section academicYear")
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
      .populate("classRoom", "grade section academicYear")
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
    const { courseTemplateId, academicYear, classRoomId, teacherId } = req.body;

    const instance = await CourseInstance.findById(req.params.id);
    if (!instance) {
      return res.status(404).json({ message: "Course instance not found" });
    }

    if (classRoomId) {
      const classRoom = await ClassRoom.findById(classRoomId);
      if (!classRoom) {
        return res.status(404).json({ message: "ClassRoom not found" });
      }

      instance.classRoom = classRoomId;
      instance.grade = classRoom.grade;
      instance.section = classRoom.section;

      // update students
      const students = await User.find({
        role: "student",
        status: "active",
        "studentProfile.classRoom": classRoomId,
      }).select("_id");

      instance.students = students.map((s) => s._id);
    }

    instance.courseTemplate = courseTemplateId;
    instance.academicYear = academicYear;
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



