const express = require("express");
const router = express.Router();
const { upload, uploadImages } = require("../controllers/uploadController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post(
  "/images",
  protect,
  authorize("owner", "admin"),
  upload.array("images", 10),
  uploadImages
);

module.exports = router;
