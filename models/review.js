const mongoose = require("mongoose");

const reviews = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  videographerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VideographerProfile",
    required: true
  },
  clientName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.models.Review || mongoose.model("Review", reviews);