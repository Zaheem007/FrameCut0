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
    default: ""
  },
  videoFile: {
    type: String,  // base64 encoded video
    default: ""
  },
  mediaType: {
    type: String,
    enum: ["url", "file", "both"],
    default: "url"
  },
  description: {
    type: String,
    default: ""
  }
}, { timestamps: true });

module.exports = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolios);