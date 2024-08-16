import mongoose from "mongoose";

export default interface IMessage{
  _id:mongoose.Types.ObjectId,
  senderId:mongoose.Types.ObjectId,
  receiverId:mongoose.Types.ObjectId,
  message:String,
 
}