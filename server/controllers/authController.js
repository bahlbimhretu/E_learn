import User from "../models/Users.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateResetToken from "../utils/generateResetToken.js";
import { sendEmail } from "../utils/sendEmail.js";

/* =====================================================
   🔐 HELPER: GENERATE SECURE RANDOM PASSWORD
===================================================== */
const generateRandomPassword = () => {
  return crypto.randomBytes(6).toString("hex"); 
  // 12-character secure password
};

/* =====================================================
   🟢 REGISTER USER (ADMIN ONLY)
===================================================== */
export const registerUser = async (req, res) => {
  try {
    const {
      role,
      name,
      fatherName,
      grandFatherName,
      email,
      student,
      parent,
      teacher,
    } = req.body;

    // =============================
    // BASIC VALIDATION
    // =============================
    if (!role || !name || !email) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const validRoles = ["admin", "student", "teacher", "parent"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    /* =====================================================
       🎓 STUDENT REGISTRATION (WITH PARENT CREATION)
    ===================================================== */
    if (role === "student") {
      if (!student || !student.classRoom || !parent) {
        return res.status(400).json({
          message: "Classroom and parent details are required",
        });
      }

      const parentEmailExists = await User.findOne({ email: parent.email });
      if (parentEmailExists) {
        return res
          .status(400)
          .json({ message: "Parent email already exists" });
      }

      const studentPassword = generateRandomPassword();
      const parentPassword = generateRandomPassword();

      // 1️⃣ CREATE PARENT
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

      // 2️⃣ CREATE STUDENT
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

      // 3️⃣ LINK CHILD TO PARENT
      parentUser.parentProfile.children.push(studentUser._id);
      await parentUser.save();

      // 📧 SEND EMAILS
      await sendEmail({
        email: studentUser.email,
        subject: "Your LMS Student Account",
        message: `
          <h2>Welcome to Tsinseta LMS</h2>
          <p>Hello ${studentUser.name},</p>
          <p>Your student account has been created.</p>
          <p><strong>Email:</strong> ${studentUser.email}</p>
          <p><strong>Temporary Password:</strong> ${studentPassword}</p>
          <p>Please login and change your password immediately.</p>
        `,
      });

      await sendEmail({
        email: parentUser.email,
        subject: "Your LMS Parent Account",
        message: `
          <h2>Welcome to Tsinseta LMS</h2>
          <p>Hello ${parentUser.name},</p>
          <p>Your parent account has been created.</p>
          <p><strong>Email:</strong> ${parentUser.email}</p>
          <p><strong>Temporary Password:</strong> ${parentPassword}</p>
          <p>Please login and change your password immediately.</p>
        `,
      });

      return res.status(201).json({
        message:
          "Student and parent registered successfully. Credentials sent via email.",
      });
    }

    /* =====================================================
       👨‍🏫 TEACHER REGISTRATION
    ===================================================== */
    if (role === "teacher") {
      if (!teacher) {
        return res.status(400).json({
          message: "Teacher details are required",
        });
      }

      const teacherPassword = generateRandomPassword();

      const teacherUser = await User.create({
        name,
        fatherName,
        grandFatherName,
        email,
        password: teacherPassword,
        role: "teacher",
        teacherProfile: {
          specialization: teacher.specialization,
          educationLevel: teacher.educationLevel,
          employmentType: teacher.employmentType,
        },
      });

      await sendEmail({
        email: teacherUser.email,
        subject: "Your LMS Teacher Account",
        message: `
          <h2>Welcome to Tsinseta LMS</h2>
          <p>Hello ${teacherUser.name},</p>
          <p>Your teacher account has been created.</p>
          <p><strong>Email:</strong> ${teacherUser.email}</p>
          <p><strong>Temporary Password:</strong> ${teacherPassword}</p>
          <p>Please login and change your password immediately.</p>
        `,
      });

      return res.status(201).json({
        message:
          "Teacher registered successfully. Credentials sent via email.",
      });
    }

    /* =====================================================
       🟣 ADMIN OR DIRECT PARENT REGISTRATION
    ===================================================== */
    const generatedPassword = generateRandomPassword();

    const user = await User.create({
      name,
      fatherName,
      grandFatherName,
      email,
      password: generatedPassword,
      role,
    });

    await sendEmail({
      email: user.email,
      subject: "Your LMS Account",
      message: `
        <h2>Welcome to Tsinseta LMS</h2>
        <p>Hello ${user.name},</p>
        <p>Your account has been created.</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Temporary Password:</strong> ${generatedPassword}</p>
        <p>Please login and change your password immediately.</p>
      `,
    });

    res.status(201).json({
      message:
        "User registered successfully. Credentials sent via email.",
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   🔑 LOGIN USER
===================================================== */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const correct = await user.matchPassword(password);
    if (!correct)
      return res.status(400).json({ message: "Invalid password" });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   🔁 FORGOT PASSWORD
===================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        message: "User with this email not found",
      });

    const { resetToken, hashed } = generateResetToken();

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Link",
      message: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link is valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "Password reset link sent." });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   🔄 RESET PASSWORD
===================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashed = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({
        message: "Invalid or expired token",
      });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      message: "Password reset successful. You can now login.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import ClassRoom from "../models/ClassRoom.js";
import { createUser } from "../services/userService.js";

export const bulkRegisterUsers = async (req, res) => {
  try {
    const { users } = req.body;

    if (!users || !users.length) {
      return res.status(400).json({ message: "No users provided" });
    }

    // 🔥 Load all classrooms once
    const classrooms = await ClassRoom.find();

    const classMap = {};
    classrooms.forEach((c) => {
      classMap[`${c.grade}-${c.section}`] = c;
    });

    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < users.length; i++) {
      const u = users[i];

      try {
        // =============================
        // NORMALIZE DATA
        // =============================
        const grade = u.grade?.trim();
        const section = u.section?.trim().toUpperCase();

        const key = `${grade}-${section}`;
        const classroom = classMap[key];

        if (!classroom) {
          throw new Error(`Class ${key} not found`);
        }

        // =============================
        // TRANSFORM TO SYSTEM FORMAT
        // =============================
        const payload = {
          role: "student",
          name: u.name,
          fatherName: u.fatherName,
          grandFatherName: u.grandFatherName,
          email: u.email,

          student: {
            classRoom: classroom._id,
            academicYear: classroom.academicYear,
          },

          parent: {
            name: u.parentName,
            email: u.parentEmail,
            phone: u.parentPhone,
          },
        };

        await createUser(payload);

        successCount++;
      } catch (err) {
        failedCount++;
        errors.push({
          row: i + 1,
          email: u.email,
          message: err.message,
        });
      }
    }

    res.json({
      successCount,
      failedCount,
      errors,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};