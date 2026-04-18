const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId:       { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
  clientEmail:     { type: String, required: true },
  videographerId:  { type: mongoose.Schema.Types.ObjectId, ref: "VideographerProfile", required: true },
  totalAmount:     { type: Number, required: true },
  advanceAmount:   { type: Number, required: true },   // 30% of totalAmount
  remainingAmount: { type: Number, required: true },   // 70% of totalAmount
  advancePaid:     { type: Boolean, default: false },
  remainingPaid:   { type: Boolean, default: false },
  razorpayOrderId: { type: String, default: "" },
  razorpayPaymentId:{ type: String, default: "" },
  status:          { type: String, enum: ["pending", "advance_paid", "fully_paid", "refunded"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);