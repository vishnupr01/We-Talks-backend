import mongoose, { Mongoose } from "mongoose";
const OtpSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true
  },
  otp:{
    type:String,
    required:true
  },
  expiry:{
    type:Date,
    expires:0 // the expires option is ttl index used for otp expires at the specied time
    
  }
},{timestamps:true})

OtpSchema.index({expiry:1},{expireAfterSeconds:0})

export const OtpModel=mongoose.model("Otp",OtpSchema) 