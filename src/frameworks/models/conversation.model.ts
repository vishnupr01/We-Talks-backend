import mongoose,{Schema} from "mongoose";
import IConversation from "../../entities/conversation.entity";

const conversationalSchema=new Schema({
  participants:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'User'
    }
  ],
  messages:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Message',
      default:[]
    }
  ]
},{timestamps:true})
const Conversation=mongoose.model<IConversation>("Conversation",conversationalSchema)
export default Conversation