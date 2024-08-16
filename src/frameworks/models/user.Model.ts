import mongoose from "mongoose";
const UserSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true
  },
  userName:{
    type:String,
    required:true,
    unique:true
  },
  name:{
    type:String,
    required:true
  },
  friends:[{
    type:mongoose.Schema.Types.ObjectId
  }],
  chats:[{
    type:mongoose.Schema.Types.ObjectId
  }],
  blockedUsers: [{
    blockedId: { type: mongoose.Schema.Types.ObjectId},
    status: { type: String }
  }],

  profileImg:{
    type:String,
    default:"https://clipground.com/images/my-profile-icon-clipart-2.jpg"
  },
  bio:{
    type:String
  },
  dob:{
  type:Date
  },
  lastActive:{
  type:Date
  },
  isBlocked:{
    type:Boolean,
    default:false
  },
saved:{
    type:[String],
    default:[]
  } 

},{timestamps:true})
export const UserModel=mongoose.model("User",UserSchema)
