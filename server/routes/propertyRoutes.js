const express = require("express");
const router = express.Router();
const {
  addProperty,
  getAllProperties,
  getPropertyById,
  getMyProperties,
  getAllPropertiesAdmin,
  updateProperty,
  deleteProperty,
  getAdminStats,
} = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", getAllProperties);
router.get("/mine", protect, authorize("owner", "admin"), getMyProperties);
router.get("/admin/all", protect, authorize("admin"), getAllPropertiesAdmin);
router.get("/admin/stats", protect, authorize("admin"), getAdminStats);
router.get("/:id", getPropertyById);

router.post("/", protect, authorize("owner", "admin"), addProperty);
router.put("/:id", protect, updateProperty);
router.delete("/:id", protect, deleteProperty);

module.exports = router;
