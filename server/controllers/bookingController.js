const Booking = require("../models/Booking");
const Property = require("../models/Property");

const createBooking = async (req, res) => {
  try {
    const { propertyId, moveInDate, message } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot book your own property",
      });
    }

    const existing = await Booking.findOne({
      property: propertyId,
      tenant: req.user.id,
      status: { $in: ["pending", "approved"] },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have an active booking for this property",
      });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user.id,
      owner: property.owner,
      moveInDate,
      message,
    });

    const populated = await Booking.findById(booking._id)
      .populate("property", "title city price images")
      .populate("tenant", "fullName email phone")
      .populate("owner", "fullName email phone");

    res.status(201).json({
      success: true,
      message: "Booking request sent",
      booking: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user.id })
      .populate("property", "title city price images address")
      .populate("owner", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ owner: req.user.id })
      .populate("property", "title city price images")
      .populate("tenant", "fullName email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (
      booking.owner.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    booking.status = status;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("property", "title city price images")
      .populate("tenant", "fullName email phone");

    res.status(200).json({
      success: true,
      message: `Booking ${status}`,
      booking: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title city price")
      .populate("tenant", "fullName email")
      .populate("owner", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  getAllBookings,
};
