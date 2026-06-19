const express = require("express");
const router = express.Router();
const {
  createSavedSearch,
  getSavedSearches,
  deleteSavedSearch,
} = require("../controllers/savedSearchController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("tenant", "admin"), getSavedSearches);
router.post("/", protect, authorize("tenant", "admin"), createSavedSearch);
router.delete("/:id", protect, authorize("tenant", "admin"), deleteSavedSearch);

module.exports = router;
