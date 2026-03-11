const express = require("express");
const Booking = require("../models/booking");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("videographerId", "name");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/create", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/videographer/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ videographerId: req.params.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;