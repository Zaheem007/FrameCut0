const mongoose = require("mongoose");

const videoprofiles = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  name:           { type: String },
  location:       { type: String },
  experience:     { type: String },
  services:       { type: String },         // comma-joined string of event types
  selectedEvents: { type: [String], default: [] },  // array of selected event type strings
  pricing:        { type: Number },         // base/min price
  servicePricing: {                         // array of {name, price} objects
    type: [{
      name:  { type: String },
      price: { type: String },
    }],
    default: [],
  },
  bio:            { type: String },
  profileImage:   { type: String },
  equipment:      { type: String },         // textarea content listing equipment
});

module.exports = mongoose.models.VideographerProfile || mongoose.model("VideographerProfile", videoprofiles);