const express = require("express");
const VideographerProfile = require("../models/videoprof");
const { protect, roleRequired, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/create", protect, roleRequired("videographer"), async (req, res) => {
  try {
    const { userId: ignoredUserId, ...rest } = req.body;

    const profile = await VideographerProfile.findOneAndUpdate(
      { userId: req.user.id },
      { userId: req.user.id, ...rest },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile saved successfully", profile });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/", async (req, res) => {
  try {
    const { location } = req.query;
    let filter = {};
    if (location) {
      const escapedLocation = location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.location = { $regex: escapedLocation, $options: "i" };
    }
    const profiles = await VideographerProfile.find(filter);
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/user/:userId", async (req, res) => {
  try {
    const profile = await VideographerProfile.findOne({ userId: req.params.userId });
    if (!profile) return res.status(404).json({ message: "No profile found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/delete/:id", protect, adminOnly, async (req, res) => {
  try {
    await VideographerProfile.findByIdAndDelete(req.params.id);
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.put("/update/:id", protect, async (req, res) => {
  try {
    const existing = await VideographerProfile.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Profile not found" });
    if (req.user.role !== "admin" && String(existing.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "You cannot update this profile" });
    }
    const { userId: ignoredUserId, _id: ignoredId, ...updates } = req.body;
    const updatedProfile = await VideographerProfile.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    res.json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const profile = await VideographerProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;