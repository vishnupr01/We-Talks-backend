import mongoose from "mongoose";
const AuthSchema=new mongoose.Schema({
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
    required:true,
  },
  password:{
    type:String,
    
  },
  verified:{
    type:Boolean,
    default:false
  },
  token:[{
    type:String
  }],
  userid:{
    type:mongoose.Types.ObjectId
  }
})
export const AuthModel=mongoose.model("Auth",AuthSchema)