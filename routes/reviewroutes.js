const express = require("express");
const Review = require("../models/review");
const router = express.Router();
router.post("/add", async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:videographerId", async (req, res) => {
  try {
    const reviews = await Review.find({
      videographerId: req.params.videographerId
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;