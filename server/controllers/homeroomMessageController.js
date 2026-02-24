import Message from "../models/Message.js";
import User from "../models/Users.js";
import ClassRoom from "../models/ClassRoom.js";

export const sendMessage = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Message content required" });
    }

    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const parentId = student.studentProfile?.guardian;
    const classRoomId = student.studentProfile?.classRoom;

    if (!parentId || !classRoomId) {
      return res.status(400).json({ message: "Student not properly linked" });
    }

    const classRoom = await ClassRoom.findById(classRoomId);

    // =========================
    // 🧑‍🏫 TEACHER SENDING
    // =========================
    if (req.user.role === "teacher") {
      if (!classRoom.homeRoomTeacher.equals(req.user._id)) {
        return res.status(403).json({ message: "Not homeroom teacher" });
      }

      const message = await Message.create({
        student: studentId,
        classRoom: classRoomId,
        teacher: req.user._id,
        parent: parentId,
        senderRole: "teacher",
        content
      });

      return res.status(201).json(message);
    }

    // =========================
    // 👨‍👩‍👧 PARENT SENDING
    // =========================
    if (req.user.role === "parent") {
      if (!parentId.equals(req.user._id)) {
        return res.status(403).json({ message: "Not your child" });
      }

      const message = await Message.create({
        student: studentId,
        classRoom: classRoomId,
        teacher: classRoom.homeRoomTeacher,
        parent: req.user._id,
        senderRole: "parent",
        content
      });

      return res.status(201).json(message);
    }

    return res.status(403).json({ message: "Unauthorized role" });

  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getConversation = async (req, res) => {
  console.log("REQ USER:", req.user);
  try {
    const { studentId } = req.params;

    const student = await User.findById(studentId);

    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const parentId = student.studentProfile?.guardian;
    const classRoomId = student.studentProfile?.classRoom;

    if (!parentId || !classRoomId) {
      return res.status(400).json({ message: "Invalid student" });
    }

    const classRoom = await ClassRoom.findById(classRoomId);

    // 🔐 Teacher Access Check
    if (req.user.role === "teacher") {
      if (!classRoom.homeRoomTeacher.equals(req.user._id)) {
        return res.status(403).json({ message: "Not homeroom teacher" });
      }
    }

    // 🔐 Parent Access Check
    if (req.user.role === "parent") {
      if (!parentId.equals(req.user._id)) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const messages = await Message.find({ student: studentId })
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (error) {
    console.error("GET CONVERSATION ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};