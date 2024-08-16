import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },

},{timestamps:true});

const commentSchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  likes:{
    type:Number,
    default:0
  },
  liked:{
    type:[String],
    default:[]
  } ,
  replies: [replySchema],
   // Array of replies
 
},{timestamps:true});
const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
