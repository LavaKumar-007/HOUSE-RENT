const mongoose = require("mongoose");

const savedSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    filters: {
      city: String,
      propertyType: String,
      minPrice: Number,
      maxPrice: Number,
      bedrooms: Number,
      search: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedSearch", savedSearchSchema);
