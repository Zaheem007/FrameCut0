const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/payment");
const Booking = require("../models/booking");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order for advance payment (30%)
router.post("/create-order", async (req, res) => {
  try {
    const { bookingId, totalAmount, clientEmail, videographerId } = req.body;
    const advanceAmount = Math.round(totalAmount * 0.30);
    const remainingAmount = totalAmount - advanceAmount;

    // Create Razorpay order (amount in paise)
    const order = await razorpay.orders.create({
      amount: advanceAmount * 100,
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    });

    // Save payment record
    const payment = new Payment({
      bookingId,
      clientEmail,
      videographerId,
      totalAmount,
      advanceAmount,
      remainingAmount,
      razorpayOrderId: order.id,
      status: "pending",
    });
    await payment.save();

    res.json({
      orderId: order.id,
      advanceAmount,
      remainingAmount,
      totalAmount,
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
});

// Verify payment signature and mark advance as paid
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(paymentId, {
      razorpayPaymentId: razorpay_payment_id,
      advancePaid: true,
      status: "advance_paid",
    }, { new: true });

    res.json({ message: "Advance payment verified successfully", payment });
  } catch (error) {
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
});

// Get payment details by bookingId
router.get("/booking/:bookingId", async (req, res) => {
  try {
    const payment = await Payment.findOne({ bookingId: req.params.bookingId });
    if (!payment) return res.status(404).json({ message: "No payment found for this booking" });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all payments for a videographer
router.get("/videographer/:videographerId", async (req, res) => {
  try {
    const payments = await Payment.find({ videographerId: req.params.videographerId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;