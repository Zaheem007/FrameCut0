const express = require("express");
const Portfolio = require("../models/portfolio");
const VideographerProfile = require("../models/videoprof");
const { protect, roleRequired } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/add", protect, roleRequired("videographer"), async (req, res) => {
  try {
    const { videographerId, title, videoUrl, videoFile, mediaType, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!videoUrl && !videoFile) return res.status(400).json({ message: "Either a video URL or uploaded file is required" });
    const profile = await VideographerProfile.findOne({ _id: videographerId, userId: req.user.id });
    if (!profile) return res.status(403).json({ message: "You can only add items to your own portfolio" });
    if (videoFile && (!videoFile.startsWith("data:video/") || videoFile.length > 70 * 1024 * 1024)) {
      return res.status(400).json({ message: "Video file is invalid or too large" });
    }

    const portfolio = new Portfolio({
      videographerId,
      title,
      videoUrl: videoUrl || "",
      videoFile: videoFile || "",
      mediaType: mediaType || (videoFile ? "file" : "url"),
      description: description || ""
    });
    await portfolio.save();
    res.status(201).json({ message: "Portfolio item added", portfolio });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:videographerId", async (req, res) => {
  try {
    const items = await Portfolio.find({ videographerId: req.params.videographerId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/:id", protect, roleRequired("videographer", "admin"), async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Portfolio item not found" });
    if (req.user.role !== "admin") {
      const profile = await VideographerProfile.findOne({ _id: item.videographerId, userId: req.user.id });
      if (!profile) return res.status(403).json({ message: "You can only delete your own portfolio items" });
    }
    await item.deleteOne();
    res.json({ message: "Portfolio item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;