const express = require("express");
const {
  createUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes (require authentication)
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.post("/change-password", protect, changePassword);

// Admin-only routes
router.post("/", protect, authorize(["admin"]), createUser);
router.get("/", protect, authorize(["admin"]), getAllUsers);
router.delete("/:id", protect, authorize(["admin"]), deleteUser);

module.exports = router;
