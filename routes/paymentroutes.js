const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/booking");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order (30% advance)
router.post("/create-order", protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const user = await User.findById(req.user.id).select("email role");
    if (req.user.role !== "admin" && (req.user.role !== "client" || booking.clientEmail !== user.email)) {
      return res.status(403).json({ message: "You cannot pay for this booking" });
    }
    const totalAmount = Number(booking.agreedPrice);
    if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: "Booking has no valid amount" });
    }
    const advanceAmount = Math.round(totalAmount * 0.30);

    const order = await razorpay.orders.create({
      amount: advanceAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_${bookingId}`,
    });

    booking.paymentOrderId = order.id;
    await booking.save();
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
    res.status(500).json({ message: "Failed to create payment order" });
  }
});

// Verify payment and mark booking as Advance Paid
router.post("/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    const user = await User.findById(req.user.id).select("email");
    if (req.user.role !== "admin" && booking.clientEmail !== user.email) {
      return res.status(403).json({ message: "You cannot verify this booking payment" });
    }
    if (!booking.paymentOrderId || booking.paymentOrderId !== razorpay_order_id) {
      return res.status(400).json({ message: "Payment order does not match booking" });
    }

    // Verify HMAC signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    const signaturesMatch = expectedSignature.length === razorpay_signature?.length &&
      crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(razorpay_signature || ""));
    if (!signaturesMatch) {
      return res.status(400).json({ message: "Payment verification failed. Invalid signature." });
    }

    // Mark booking payment status as Advance Paid
    booking.paymentStatus = "Advance Paid";
    await booking.save();

    res.json({ message: "Payment verified successfully", paymentId: razorpay_payment_id });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ message: "Verification failed" });
  }
});

module.exports = router;