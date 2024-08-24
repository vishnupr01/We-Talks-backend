import mongoose from "mongoose";
export interface IReport extends Document {
  postId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  description: string;
  createdAt?: Date |undefined
  updatedAt?: Date |undefined
}