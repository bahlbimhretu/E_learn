import User from "../models/Users.js";

/**
 * ======================================================
 * @desc    Get all users (Admin)
 * @route   GET /api/users
 * @access  Admin
 * Optional query: ?role=student|teacher|parent|admin
 * ======================================================
 */
export const getUsers = async (req, res) => {
  try {
    const { role } = req.query;

    const filter = role ? { role } : {};
    const users = await User.find(filter).select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ======================================================
 * @desc    Get single user by ID (Admin)
 * @route   GET /api/users/:id
 * @access  Admin
 * ======================================================
 */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ======================================================
 * @desc    Update user role (Admin)
 * @route   PUT /api/users/:id/role
 * @access  Admin
 * ======================================================
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const validRoles = ["admin", "teacher", "student", "parent"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ======================================================
 * @desc    Delete user (Admin)
 * @route   DELETE /api/users/:id
 * @access  Admin
 * ======================================================
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Safety rule: do not delete admin
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin accounts cannot be deleted",
      });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
