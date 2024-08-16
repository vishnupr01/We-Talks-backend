import mongoose, { Document, Types } from 'mongoose';

// Define IBlockedUser interface
export interface IBlockedUser {
  blockedId: Types.ObjectId;
  status: string;
}

// Define IUser interface extending Mongoose Document
export default interface IUser extends Document {
  id: string;
  userName: string;
  name: string;
  email: string;
  dob: Date; // Use Date type for date fields
  lastActive: Date;
  profileImg: string;
  password: string;
  friends: Types.ObjectId[]; // Array of ObjectId instances
  isBlocked: boolean;
  bio: string;
  saved: string[];
  blockedUsers: IBlockedUser[]; // Array of IBlockedUser
}
