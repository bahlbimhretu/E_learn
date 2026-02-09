import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import CourseInstance from "./CourseInstance.js";
const userSchema = mongoose.Schema(
  {
    // 🔹 Common fields
    name: { type: String, required: true },
    fatherName: String,
    grandFatherName: String,

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      default: "student",
    },

    avatar: String,

    // ✅ ADD THIS (VERY IMPORTANT)
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "graduated"],
      default: "active",
    },

    // 🔹 Student-specific
    studentProfile: {
      grade: { type: String },
      section: { type: String },
      academicYear: String,

      guardian: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // parent
      },
    },

    // 🔹 Parent-specific
    parentProfile: {
      phone: String,
      children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],
    },

    // 🔹 Teacher-specific
    teacherProfile: {
      specialization: String,
      educationLevel: String,
    },

    // 🔹 Security
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// 🔐 Password hashing
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 🔐 Password comparison
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// 🔁 AUTO-ENROLL NEW STUDENTS INTO EXISTING COURSE INSTANCES
// 🔁 AUTO-ENROLL NEW STUDENTS INTO EXISTING COURSE INSTANCES
userSchema.post("save", async function (doc) {
  try {
    console.log("Auto-enroll hook triggered for student:", doc.name);

    // 🔹 Only for newly created active students
    if (!doc.isNew) {
      console.log("Skipped: Not a new student");
      return;
    }
    if (doc.role !== "student") {
      console.log("Skipped: Not a student");
      return;
    }
    if (doc.status !== "active") {
      console.log("Skipped: Student not active");
      return;
    }

    // 🔹 Ensure studentProfile has required fields
    const { grade, section, academicYear } = doc.studentProfile || {};
    if (!grade || !section || !academicYear) {
      console.log("Skipped: Missing studentProfile fields", doc.studentProfile);
      return;
    }

    const CourseInstance = mongoose.model("CourseInstance");

    // 🔹 Find matching course instances
    const courses = await CourseInstance.find({
      academicYear,
      grade,
      section,
      status: "active",
    });

    if (!courses.length) {
      console.log(
        `No active course instances found for Grade ${grade}, Section ${section}, Year ${academicYear}`
      );
      return;
    }

    // 🔹 Enroll student in each matching course
    for (const course of courses) {
      const result = await CourseInstance.updateOne(
        { _id: course._id },
        { $addToSet: { students: doc._id } }
      );
      console.log(
        `Student ${doc.name} added to CourseInstance ${course._id}:`,
        result.modifiedCount ? "Enrolled" : "Already enrolled"
      );
    }

    console.log(`Auto-enrollment complete for student: ${doc.name}`);
  } catch (error) {
    console.error("Error in auto-enroll hook for student:", doc.name, error);
  }
});



export default mongoose.model("User", userSchema);
