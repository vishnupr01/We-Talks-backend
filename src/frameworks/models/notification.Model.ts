import mongoose, { Schema } from "mongoose";
import INotification from "../../entities/notification.entity";

const notificationSchema=new Schema({
  type:{
    type:String,
    enum:['like','comment','friend_request'],
    required:true
  },
  sender:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  receiver:{
    type:Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  postId:{
    type:Schema.Types.ObjectId,
    ref:'Post'
  },
  message:{
    type:String
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  read:{
    type:Boolean,
    default:false
  }

})
export const NotificationModel=mongoose.model<INotification>('Notification',notificationSchema)
