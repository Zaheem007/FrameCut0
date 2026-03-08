const express = require("express");
const Portfolio = require("../models/portfolio");

const router = express.Router();
router.post("/add", async (req, res) => {
  try {
    const portfolio = new Portfolio(req.body);
    await portfolio.save();

    res.status(201).json({
      message: "Portfolio item added",
      portfolio
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:videographerId", async (req, res) => {
  try {
    const portfolioItems = await Portfolio.find({
      videographerId: req.params.videographerId
    });

    res.json(portfolioItems);
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