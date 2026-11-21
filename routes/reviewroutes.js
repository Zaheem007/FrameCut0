const express = require("express");
const Review = require("../models/review");
const Booking = require("../models/booking");
const User = require("../models/user");
const { protect, roleRequired } = require("../middleware/authMiddleware");
const router = express.Router();

// Add a review
router.post("/add", protect, roleRequired("client"), async (req, res) => {
  try {
    const { bookingId, videographerId, rating, comment } = req.body;
    if (!bookingId || !videographerId || !Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ message: "A valid booking, videographer, and rating are required" });
    }
    const user = await User.findById(req.user.id).select("name email");
    const booking = await Booking.findOne({ _id: bookingId, videographerId, clientEmail: user.email });
    if (!booking) return res.status(403).json({ message: "You can only review your own booking" });
    const alreadyReviewed = await Review.exists({ bookingId });
    if (alreadyReviewed) return res.status(409).json({ message: "This booking has already been reviewed" });
    const review = new Review({
      bookingId,
      videographerId,
      clientName: user.name,
      rating: Number(rating),
      comment: comment || "",
    });
    await review.save();
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reviews for a videographer
router.get("/:videographerId", async (req, res) => {
  try {
    const reviews = await Review.find({ videographerId: req.params.videographerId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/clients/:userId", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin" && String(req.user.id) !== String(req.params.userId)) {
      return res.status(403).json({ message: "You cannot access these reviews" });
    }
    const user = await User.findById(req.params.userId).select("email");
    if (!user) return res.status(404).json({ message: "User not found" });
    const bookings = await Booking.find({ clientEmail: user.email }).select("_id");
    const reviews = await Review.find({ bookingId: { $in: bookings.map(booking => booking._id) } });
    res.json(reviews);
  } catch (error) {
    console.error("List client reviews error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get average ratings for ALL videographers in one call
router.get("/averages/all", async (req, res) => {
  try {
    const averages = await Review.aggregate([
      { $group: {
        _id: "$videographerId",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 }
      }}
    ]);
    // Return as a map { videographerId: { avg, count } }
    const map = {};
    averages.forEach(r => { map[r._id.toString()] = { avg: Math.round(r.avgRating * 10) / 10, count: r.count }; });
    res.json(map);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;