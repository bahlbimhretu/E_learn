import User from "../models/Users.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import generateResetToken from "../utils/generateResetToken.js";
import { sendEmail } from "../utils/sendEmail.js";

// ===============================
// REGISTER USER (ADMIN ONLY)
// ===============================
export const registerUser = async (req, res) => {
  try {
    const {
      role,
      name,
      fatherName,
      grandFatherName,
      email,
      password,

      student,
      parent,
      teacher,
    } = req.body;

    // -----------------------------
    // BASIC VALIDATION
    // -----------------------------
    if (!role || !name || !email || !password) {
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

    // =============================
    // STUDENT REGISTRATION
    // =============================
    // =============================
// STUDENT REGISTRATION
// =============================
if (role === "student") {
  if (!student || !student.classRoom || !parent) {
    return res.status(400).json({
      message: "Classroom and parent details are required",
    });
  }

  // check parent email
  const parentEmailExists = await User.findOne({ email: parent.email });
  if (parentEmailExists) {
    return res
      .status(400)
      .json({ message: "Parent email already exists" });
  }

  // 1️⃣ CREATE PARENT
  const parentUser = await User.create({
    name: parent.name,
    fatherName: "N/A",
    grandFatherName: "N/A",
    email: parent.email,
    password: parent.password,
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
    password,
    role: "student",
    studentProfile: {
      classRoom: student.classRoom,   // ✅ NEW
      academicYear: student.academicYear,
      guardian: parentUser._id,
    },
  });

  // 3️⃣ LINK CHILD → PARENT
  parentUser.parentProfile.children.push(studentUser._id);
  await parentUser.save();

  return res.status(201).json({
    message: "Student and parent registered successfully",
    student: {
      id: studentUser._id,
      name: studentUser.name,
    },
    parent: {
      id: parentUser._id,
      name: parentUser.name,
    },
  });
}

    // =============================
    // TEACHER REGISTRATION
    // =============================
    if (role === "teacher") {
      if (!teacher) {
        return res.status(400).json({
          message: "Teacher details are required",
        });
      }

      const teacherUser = await User.create({
        name,
        fatherName,
        grandFatherName,
        email,
        password,
        role: "teacher",
        teacherProfile: {
          specialization: teacher.specialization,
          educationLevel: teacher.educationLevel,
          employmentType: teacher.employmentType,
        },
      });

      return res.status(201).json({
        message: "Teacher registered successfully",
        user: {
          id: teacherUser._id,
          name: teacherUser.name,
          role: teacherUser.role,
        },
      });
    }

    // =============================
    // ADMIN / PARENT REGISTRATION
    // =============================
    const user = await User.create({
      name,
      fatherName,
      grandFatherName,
      email,
      password,
      role,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// LOGIN USER
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
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


// ===============================
// FORGOT PASSWORD
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User with this email not found" });

    // Generate reset token
    const { resetToken, hashed } = generateResetToken();

    user.resetPasswordToken = hashed;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // valid 10 mins
   await user.save({ validateBeforeSave: false });


    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Password Reset Request</h3>
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">${resetUrl}</a>
      <br/><br/>
      <p>This link is valid for <strong>10 minutes</strong>.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset Link",
      message,
    });

    res.json({ message: "Password reset link sent to your email." });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// ===============================
// RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // hash provided token to compare with DB
    const hashed = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful. You can now login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
