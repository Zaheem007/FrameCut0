const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/booking");
const User = require("../models/user");
const VideographerProfile = require("../models/videoprof");
const { protect, roleRequired, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

const getOwnedProfile = (req, profileId) =>
  VideographerProfile.findOne({
    _id: profileId,
    ...(req.user.role === "admin" ? {} : { userId: req.user.id }),
  });

router.get("/", protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "client") {
      const user = await User.findById(req.user.id).select("email");
      if (!user) return res.status(404).json({ message: "User not found" });
      filter.clientEmail = user.email;
    } else if (req.user.role === "videographer") {
      const profile = await VideographerProfile.findOne({ userId: req.user.id }).select("_id");
      if (!profile) return res.json([]);
      filter.videographerId = profile._id;
    }
    const bookings = await Booking.find(filter).populate("videographerId", "name");
    res.json(bookings);
  } catch (error) {
    console.error("List bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/create", protect, roleRequired("client"), async (req, res) => {
  try {
    const { videographerId, eventType, selectedService, eventDate, eventLocation, notes } = req.body;
    if (!mongoose.isValidObjectId(videographerId) || !eventDate || !eventLocation?.trim()) {
      return res.status(400).json({ message: "Videographer, event date, and location are required" });
    }

    const profile = await VideographerProfile.findById(videographerId);
    if (!profile) return res.status(404).json({ message: "Videographer profile not found" });
    if (profile.availableDates.length && !profile.availableDates.includes(eventDate)) {
      return res.status(400).json({ message: "That date is not available" });
    }

    const selected = profile.servicePricing.find(service => service.name === selectedService);
    if (profile.servicePricing.length && !selected) {
      return res.status(400).json({ message: "Please select a valid service" });
    }
    const user = await User.findById(req.user.id).select("email");
    const booking = new Booking({
      clientEmail: user.email,
      videographerId,
      eventType: eventType || selectedService || "",
      selectedService: selected?.name || "",
      agreedPrice: selected?.price || "",
      eventDate,
      eventLocation: eventLocation.trim(),
      notes: notes || "",
    });
    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/videographer/:id", protect, async (req, res) => {
  try {
    const profile = await getOwnedProfile(req, req.params.id);
    if (!profile) return res.status(403).json({ message: "You cannot access these bookings" });
    const bookings = await Booking.find({ videographerId: profile._id });
    res.json(bookings);
  } catch (error) {
    console.error("List videographer bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/update/:id", protect, async (req, res) => {
  try {
    if (!["Confirmed", "Pending", "Approved", "Rejected", "Completed", "Cancelled"].includes(req.body.status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const profile = await getOwnedProfile(req, booking.videographerId);
    if (req.user.role !== "admin" && !profile) return res.status(403).json({ message: "You cannot update this booking" });
    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error("Update booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/pay-advance/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Advance Paid" },
      { new: true, runValidators: true }
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    console.error("Mark advance paid error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
