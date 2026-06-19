const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  getMe,
  toggleFavorite,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail);
router.post("/resend-verification", resendVerification);
router.get("/me", protect, getMe);
router.post("/favorites/:propertyId", protect, toggleFavorite);

module.exports = router;
