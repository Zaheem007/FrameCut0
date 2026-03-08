const mongoose = require("mongoose");

const portfolios = new mongoose.Schema({
  videographerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VideographerProfile",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolios);