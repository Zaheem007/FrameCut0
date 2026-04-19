const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order (30% advance)
router.post("/create-order", async (req, res) => {
  try {
    const { bookingId, totalAmount, clientEmail } = req.body;
    const advanceAmount = Math.round(totalAmount * 0.30);

    const order = await razorpay.orders.create({
      amount: advanceAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    });

    res.json({
      orderId: order.id,
      advanceAmount,
      remainingAmount: totalAmount - advanceAmount,
      totalAmount,
      paymentId: order.id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Failed to create payment order", error: error.message });
  }
});

// Verify payment and mark booking as Advance Paid
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

    // Verify HMAC signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // Mark booking payment status as Advance Paid
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "Advance Paid" });

    res.json({ message: "Payment verified successfully", paymentId: razorpay_payment_id });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
});

module.exports = router;