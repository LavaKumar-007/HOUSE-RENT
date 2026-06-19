const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookings,
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("tenant", "admin"), createBooking);
router.get("/mine", protect, authorize("tenant", "admin"), getMyBookings);
router.get(
  "/owner",
  protect,
  authorize("owner", "admin"),
  getOwnerBookings
);
router.get("/all", protect, authorize("admin"), getAllBookings);
router.patch("/:id/status", protect, updateBookingStatus);

module.exports = router;
