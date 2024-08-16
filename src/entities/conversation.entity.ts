import mongoose from "mongoose";

export default interface IConversation{
  participants:mongoose.Types.ObjectId[],
  messages:mongoose.Types.ObjectId[],
  updatedAt:Date
 
}