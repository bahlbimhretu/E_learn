import ClassRoom from "../models/ClassRoom.js";
import User from "../models/Users.js";

// 🏫 CREATE CLASSROOM
export const createClassRoom = async (req, res) => {
  try {
    const { academicYear, grade, section, homeRoomTeacher } = req.body;

    if (!academicYear || !grade || !section) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const classRoom = await ClassRoom.create({
      academicYear,
      grade,
      section,
      homeRoomTeacher: homeRoomTeacher || null,
      createdBy: req.user._id,
    });

    res.status(201).json(classRoom);
  } catch (error) {
    console.error("CREATE CLASSROOM ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Class already exists for this year",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// 📚 GET ALL CLASSROOMS
export const getClassRooms = async (req, res) => {
  try {
    const classes = await ClassRoom.find()
      .populate("homeRoomTeacher", "name email")
      .lean();

    // attach student count
    const classesWithCounts = await Promise.all(
      classes.map(async (cls) => {
        const count = await User.countDocuments({
          role: "student",
          "studentProfile.classRoom": cls._id,
        });

        return { ...cls, studentCount: count };
      })
    );

    res.json(classesWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📖 GET SINGLE CLASSROOM (WITH STUDENTS)
export const getClassRoomById = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findById(req.params.id)
      .populate("homeRoomTeacher", "name email")
      .lean();

    if (!classRoom) {
      return res.status(404).json({ message: "Class not found" });
    }

    // 🔹 load students belonging to this class
    const students = await User.find({
      role: "student",
      "studentProfile.classRoom": classRoom._id,
      status: "active",
    }).select("name email studentProfile");

    res.json({ ...classRoom, students });
  } catch (error) {
    console.error("GET CLASSROOM BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 👨‍🏫 ASSIGN HOME ROOM TEACHER (Existing Function Kept)
export const assignHomeRoomTeacher = async (req, res) => {
  try {
    const { teacherId } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "Invalid teacher" });
    }

    const classRoom = await ClassRoom.findById(req.params.id);
    if (!classRoom) {
      return res.status(404).json({ message: "Class not found" });
    }

    classRoom.homeRoomTeacher = teacherId;
    await classRoom.save();

    res.json(classRoom);
  } catch (error) {
    console.error("ASSIGN HOMEROOM TEACHER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ UPDATE CLASSROOM (Modified to include homeRoomTeacher)
export const updateClassRoom = async (req, res) => {
  try {
    const { academicYear, grade, section, status, homeRoomTeacher } = req.body;

    const classRoom = await ClassRoom.findById(req.params.id);
    if (!classRoom) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Update existing fields
    if (academicYear) classRoom.academicYear = academicYear;
    if (grade) classRoom.grade = grade;
    if (section) classRoom.section = section;
    if (status) classRoom.status = status;

    // 🔥 Added teacher update functionality
    if (homeRoomTeacher !== undefined) {
      if (homeRoomTeacher) {
        // Verify teacher exists and has correct role
        const teacher = await User.findById(homeRoomTeacher);
        if (!teacher || teacher.role !== "teacher") {
          return res.status(400).json({ message: "Invalid teacher assignment" });
        }
        classRoom.homeRoomTeacher = homeRoomTeacher;
      } else {
        // If null or empty, unassign the teacher
        classRoom.homeRoomTeacher = null;
      }
    }

    await classRoom.save();

    // Re-populate to send back the full teacher object for the UI
    const result = await ClassRoom.findById(classRoom._id).populate("homeRoomTeacher", "name email");

    res.json(result);
  } catch (error) {
    console.error("UPDATE CLASSROOM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🗄 ARCHIVE CLASSROOM
export const archiveClassRoom = async (req, res) => {
  try {
    const classRoom = await ClassRoom.findByIdAndUpdate(
      req.params.id,
      { status: "archived" },
      { new: true }
    );

    if (!classRoom) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json(classRoom);
  } catch (error) {
    console.error("ARCHIVE CLASSROOM ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};