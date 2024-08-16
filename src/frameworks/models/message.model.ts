import mongoose, { Schema } from "mongoose";
import IMessage from "../../entities/message.entity";

const messageSchema=new Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  message:{
    type:String,
    required:true
  }
},{timestamps:true})
const Message=mongoose.model<IMessage>("Message",messageSchema)
export default Message