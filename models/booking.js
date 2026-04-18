const express = require("express");
const Booking = require("../models/booking");

const router = express.Router();

/* GET ALL BOOKINGS — used by AdminDash and Home */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("videographerId", "name");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* CREATE BOOKING */
router.post("/create", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

/* GET BOOKINGS FOR A SPECIFIC VIDEOGRAPHER */
router.get("/videographer/:id", async (req, res) => {
  try {
    const bookings = await Booking.find({ videographerId: req.params.id });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* UPDATE BOOKING STATUS */
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

/* MARK ADVANCE PAYMENT AS PAID */
router.put("/pay-advance/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Advance Paid" },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;