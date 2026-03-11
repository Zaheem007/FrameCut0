const mongoose = require("mongoose");

const videoprofiles = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  name:           { type: String },
  location:       { type: String },
  experience:     { type: String },
  services:       { type: String },         
  selectedEvents: { type: [String], default: [] },  
  pricing:        { type: Number },         
  servicePricing: {                         
    type: [{
      name:  { type: String },
      price: { type: String },
    }],
    default: [],
  },
  bio:            { type: String },
  profileImage:   { type: String },
  equipment:      { type: String },         
});

module.exports = mongoose.models.VideographerProfile || mongoose.model("VideographerProfile", videoprofiles);