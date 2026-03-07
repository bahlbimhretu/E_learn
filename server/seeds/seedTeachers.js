import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/Users.js"; // adjust path if needed

const updatePassword = async () => {
  try {

    const userId = "69ab084cf8cdcf57e7d582c3";

    const hashedPassword = await bcrypt.hash("1234", 10);

    await User.findByIdAndUpdate(userId, {
      password: hashedPassword
    });

    console.log("Password updated successfully");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

updatePassword();