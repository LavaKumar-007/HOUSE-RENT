const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  getMe,
  updateProfile,
  changePassword,
  getFavorites,
  toggleFavorite,
  getAllUsers,
} = require("../controllers/authController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.get("/favorites", protect, getFavorites);
router.post("/favorites/:propertyId", protect, toggleFavorite);
router.get("/users", protect, authorize("admin"), getAllUsers);

module.exports = router;
