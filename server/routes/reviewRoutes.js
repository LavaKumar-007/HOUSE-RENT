const express = require("express");
const router = express.Router();
const { createReview, getPropertyReviews } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/:propertyId", getPropertyReviews);
router.post("/", protect, authorize("tenant", "admin"), createReview);

module.exports = router;
