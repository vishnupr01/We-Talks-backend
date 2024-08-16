import mongoose,{Schema,Document} from "mongoose";
import IPost from "../../entities/post.entity";

const PostSchema:Schema=new Schema({
  creator_id:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  caption:{
    type:String,
    required:true
  },
  images:[{
    type:String,
    required:true
  }],
  place:{
    type:String
  },
  likes:{
    type:Number,
    default:0
  },
  liked:{
    type:[String],
    default:[]
  } ,
  savedUser:{
    type:[String],
    default:[]
  }

},{timestamps:true})

export const PostModel=mongoose.model<IPost>('Post',PostSchema)