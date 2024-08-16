import mongoose,{Schema} from "mongoose";
import { IFriendRequest } from "../../entities/friendRequest.entity";


const friendRequestSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  read:{
    type:Boolean,
    default:false
  }
});
const FriendRequest = mongoose.model<IFriendRequest>('FriendRequest', friendRequestSchema);
export default FriendRequest