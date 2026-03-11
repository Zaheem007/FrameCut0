const express = require("express");
const Portfolio = require("../models/portfolio");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { videographerId, title, videoUrl, videoFile, mediaType, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    if (!videoUrl && !videoFile) return res.status(400).json({ message: "Either a video URL or uploaded file is required" });

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
router.delete("/:id", async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res.json({ message: "Portfolio item deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;