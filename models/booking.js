const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

clientEmail:{
type:String,
required:true
},

videographerId:{
type:mongoose.Schema.Types.ObjectId,
ref:"VideographerProfile",
required:true
},

eventType:{
type:String,
required:true
},

eventDate:{
type:String,
required:true
},

eventLocation:{
type:String,
required:true
},

status:{
type:String,
default:"Pending"
}

},{timestamps:true});

module.exports = mongoose.model("Booking",bookingSchema);