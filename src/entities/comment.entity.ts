import mongoose from "mongoose";

export default interface IComment {
  _id: string;
  postId: string;
  comment: string;
  author_id: string;
  replies?: IReply[];
  liked?:string[],
  likes?:number,
}

export interface IReply {
  user_id: mongoose.Types.ObjectId;
  comment: string;
}
