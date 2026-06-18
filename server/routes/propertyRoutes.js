const express = require("express");
const router = express.Router();

const {
  addProperty,
  getAllProperties,
  getPropertyById,
} = require("../controllers/propertyController");

router.get("/", getAllProperties);

router.get("/:id", getPropertyById);

router.post("/", addProperty);

module.exports = router;