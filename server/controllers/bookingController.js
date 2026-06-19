const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Notification = require("../models/Notification");
const { sendBookingNotificationEmail } = require("../utils/email");

const VALID_STATUSES = ["pending", "approved", "rejected", "cancelled"];

const createNotification = async (userId, title, message, link = "") => {
  await Notification.create({ user: userId, title, message, link });
};

const createBooking = async (req, res) => {
  try {
    const { propertyId, moveInDate, message } = req.body;

    if (!propertyId || !moveInDate) {
      return res.status(400).json({
        success: false,
        message: "Property and move-in date are required",
      });
    }

    const moveIn = new Date(moveInDate);
    if (moveIn <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Move-in date must be in the future",
      });
    }

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (!property.available) {
      return res.status(400).json({
        success: false,
        message: "This property is not available",
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

    const owner = populated.owner;
    await createNotification(
      property.owner,
      "New booking request",
      `${populated.tenant.fullName} requested to book ${property.title}`,
      "/dashboard"
    );
    if (owner?.email) {
      await sendBookingNotificationEmail({
        to: owner.email,
        subject: "New booking request on HouseHunt",
        message: `${populated.tenant.fullName} requested to book ${property.title}. Log in to approve or reject.`,
      });
    }

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

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("property", "title city price images address")
      .populate("tenant", "fullName email phone")
      .populate("owner", "fullName email phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isParty =
      booking.tenant._id.toString() === req.user.id ||
      booking.owner._id.toString() === req.user.id ||
      req.user.role === "admin";

    if (!isParty) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { tenant: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
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
    const { status } = req.query;
    const filter = { owner: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
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

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

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

    if (status === "approved") {
      await Property.findByIdAndUpdate(booking.property, { available: false });
    }

    const populated = await Booking.findById(booking._id)
      .populate("property", "title city price images")
      .populate("tenant", "fullName email phone")
      .populate("owner", "fullName email phone");

    await createNotification(
      booking.tenant,
      `Booking ${status}`,
      `Your booking for ${populated.property.title} was ${status}`,
      "/dashboard"
    );

    if (populated.tenant?.email) {
      await sendBookingNotificationEmail({
        to: populated.tenant.email,
        subject: `Booking ${status} on HouseHunt`,
        message: `Your booking for ${populated.property.title} has been ${status}.`,
      });
    }

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

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const isTenant = booking.tenant.toString() === req.user.id;
    const isOwner = booking.owner.toString() === req.user.id;

    if (!isTenant && !isOwner && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (!["pending", "approved"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking cannot be cancelled",
      });
    }

    const wasApproved = booking.status === "approved";
    booking.status = "cancelled";
    await booking.save();

    if (wasApproved) {
      await Property.findByIdAndUpdate(booking.property, { available: true });
    }

    const populated = await Booking.findById(booking._id)
      .populate("property", "title city price images")
      .populate("tenant", "fullName email phone");

    res.status(200).json({
      success: true,
      message: "Booking cancelled",
      booking: populated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
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
  getBookingById,
  getMyBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
};
