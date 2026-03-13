const express = require("express");
const Review = require("../models/review");
const router = express.Router();

// Add a review
router.post("/add", async (req, res) => {
  try {
    const review = new Review(req.body);
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