const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  clientEmail:     { type: String, required: true },
  videographerId:  { type: mongoose.Schema.Types.ObjectId, ref: "VideographerProfile", required: true },
  eventType:       { type: String, default: "" },
  eventDate:       { type: String, required: true },
  eventLocation:   { type: String, required: true },
  selectedService: { type: String, default: "" },
  agreedPrice:     { type: String, default: "" },
  notes:           { type: String, default: "" },
  status:          { type: String, default: "Confirmed" },
  paymentStatus:   { type: String, default: "Pending" },  // Pending / Advance Paid
}, { timestamps: true });

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);