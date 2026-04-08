
 // adjust path if needed

import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
import User from "../models/Users.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    // ❗ Check if admin already exists
    const existingAdmin = await User.findOne({ email: "bahlbi.mhre@g.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    // ✅ Create admin
    const admin = new User({
      name: "Admin",
      email: "admin@role.com",
      password: "12345678", // will be hashed automatically
      role: "admin",
      status: "active",
    });

    await admin.save();

    console.log("✅ Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();