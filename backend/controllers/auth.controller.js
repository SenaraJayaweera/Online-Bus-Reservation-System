import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { User } from "../models/user.model.js";

// Signup Method
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login Method
// Login Method
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    user.lastLogin = new Date();
    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined }, // Ensure role is included here
    });
  } catch (error) {
    console.log("Error in login:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};



// Logout Method
export const logout = async (req, res) => {
  // Clear the cookie named 'token' to log the user out
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Check Authentication Method
export const checkAuth = async (req, res) => {
  try {
    // Find the user by ID set by authentication middleware
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in checkAuth:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update Profile Method
export const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "At least one field (name, email, password) is required to update.",
      });
    }

    // Find the user by ID from the token
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    
    if (password) user.password = await bcryptjs.hash(password, 10);

    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "An error occurred while updating profile" });
  }
};

// Delete Profile Method
export const deleteProfile = async (req, res) => {
  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Clear token cookie after deleting account
    res.clearCookie("token");

    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({ success: false, message: "An error occurred while deleting profile" });
  }
};

// Get All Users Method
export const getAllUsers = async (req, res) => {
  try {
    // Find all users and exclude password from result
    const users = await User.find({}, "-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: error.message });
  }
};
// Get User Stats Method
export const getUserStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const totalUsers = await User.countDocuments({});
    const dailyUsers = await User.countDocuments({ createdAt: { $gte: startOfDay } });
    const weeklyUsers = await User.countDocuments({ createdAt: { $gte: startOfWeek } });
    const monthlyUsers = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        dailyUsers,
        weeklyUsers,
        monthlyUsers,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to get user stats", error: error.message });
  }
};

