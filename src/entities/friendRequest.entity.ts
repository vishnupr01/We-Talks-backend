import { Document, ObjectId } from 'mongoose';

export interface IFriendRequest extends Document {
  sender: ObjectId;
  receiver: ObjectId;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}