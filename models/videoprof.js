const mongoose=require("mongoose");
const videoprofiles=new mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    location:{
        type:String,
        required: true
    },
    experience:{
        type:String
    },
    services:{
        type:String
    },
    pricing:{
        type:Number
    },
    bio:{
        type:String,
    },
    profileImage:{
  type: String
    }
    },{ timestamps: true });
    module.exports=mongoose.model("VideographerProfile",videoprofiles);