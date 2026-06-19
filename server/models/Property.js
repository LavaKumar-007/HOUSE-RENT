const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "Villa", "Independent House", "Studio", "PG"],
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    area: {
      type: Number,
      required: true,
    },

    furnished: {
      type: Boolean,
      default: false,
    },

    parking: {
      type: Boolean,
      default: false,
    },

    images: [String],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    available: {
      type: Boolean,
      default: true,
    },

    lat: Number,
    lng: Number,

    averageRating: {
      type: Number,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({ city: 1, available: 1, price: 1 });
propertySchema.index({ title: "text", description: "text", city: "text" });

module.exports = mongoose.model("Property", propertySchema);