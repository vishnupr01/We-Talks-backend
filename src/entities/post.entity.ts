import { ObjectId } from "mongoose";
import IUser from "../entities/user.entity";

export default interface IPost{
  _id:string,
  creator_id:string,
  caption:string,
  images:string[],
  location:string,
  user?:IUser,
  liked:string[],
  likes:number,
  savedUser:string[]
}