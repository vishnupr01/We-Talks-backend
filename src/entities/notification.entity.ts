import mongoose, { Schema } from "mongoose";

export default interface INotification{
  type:string,
  sender:mongoose.Types.ObjectId,
  receiver:mongoose.Types.ObjectId,
  message:string,
  postId?: mongoose.Types.ObjectId | undefined;
}