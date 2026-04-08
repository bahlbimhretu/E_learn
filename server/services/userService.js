import User from "../models/Users.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

/* =====================================================
   🔐 PASSWORD GENERATOR
===================================================== */
const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString("hex");
};

/* =====================================================
   🧠 CORE USER CREATION LOGIC (REUSABLE)
===================================================== */
export const createUser = async (data) => {
  const {
    role,
    name,
    fatherName,
    grandFatherName,
    email,
    student,
    parent,
    teacher,
  } = data;

  // =============================
  // VALIDATION
  // =============================
  if (!role || !name || !email) {
    throw new Error("Required fields missing");
  }

  const validRoles = ["admin", "student", "teacher", "parent"];
  if (!validRoles.includes(role)) {
    throw new Error("Invalid role");
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new Error("Email already exists");
  }

  /* =============================
     🎓 STUDENT
  ============================= */
  if (role === "student") {
    if (!student || !student.classRoom || !parent) {
      throw new Error("Classroom and parent details required");
    }

    const parentEmailExists = await User.findOne({ email: parent.email });
    if (parentEmailExists) {
      throw new Error("Parent email already exists");
    }

    const studentPassword = generateRandomPassword();
    const parentPassword = generateRandomPassword();

    // CREATE PARENT
    const parentUser = await User.create({
      name: parent.name,
      fatherName: "N/A",
      grandFatherName: "N/A",
      email: parent.email,
      password: parentPassword,
      role: "parent",
      parentProfile: {
        phone: parent.phone,
        children: [],
      },
    });

    // CREATE STUDENT
    const studentUser = await User.create({
      name,
      fatherName,
      grandFatherName,
      email,
      password: studentPassword,
      role: "student",
      studentProfile: {
        classRoom: student.classRoom,
        academicYear: student.academicYear,
        guardian: parentUser._id,
      },
    });

    // LINK
    parentUser.parentProfile.children.push(studentUser._id);
    await parentUser.save();

    // EMAILS
    await sendEmail({
      email: studentUser.email,
      subject: "Student Account",
      message: `Email: ${studentUser.email}, Password: ${studentPassword}`,
    });

    await sendEmail({
      email: parentUser.email,
      subject: "Parent Account",
      message: `Email: ${parentUser.email}, Password: ${parentPassword}`,
    });

    return { success: true };
  }

  /* =============================
     👨‍🏫 TEACHER
  ============================= */
  if (role === "teacher") {
    const password = generateRandomPassword();

    await User.create({
      name,
      fatherName,
      grandFatherName,
      email,
      password,
      role: "teacher",
      teacherProfile: {
        specialization: teacher?.specialization,
        educationLevel: teacher?.educationLevel,
        employmentType: teacher?.employmentType,
      },
    });

    return { success: true };
  }

  /* =============================
     OTHER USERS
  ============================= */
  const password = generateRandomPassword();

  await User.create({
    name,
    fatherName,
    grandFatherName,
    email,
    password,
    role,
  });

  return { success: true };
};