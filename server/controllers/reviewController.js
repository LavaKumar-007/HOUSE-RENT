const Review = require("../models/Review");
const Property = require("../models/Property");
const Booking = require("../models/Booking");

const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;

    const approvedBooking = await Booking.findOne({
      property: propertyId,
      tenant: req.user.id,
      status: "approved",
    });

    if (!approvedBooking) {
      return res.status(403).json({
        success: false,
        message: "You can only review properties you have rented",
      });
    }

    const review = await Review.create({
      property: propertyId,
      tenant: req.user.id,
      rating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { property: review.property } },
      {
        $group: {
          _id: "$property",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (stats[0]) {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: Math.round(stats[0].averageRating * 10) / 10,
        reviewCount: stats[0].reviewCount,
      });
    }

    res.status(201).json({
      success: true,
      message: "Review submitted",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this property",
      });
    }
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to submit review" });
  }
};

const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate("tenant", "fullName profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch reviews" });
  }
};

module.exports = { createReview, getPropertyReviews };
