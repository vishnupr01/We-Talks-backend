import IAuth from "../entities/auth.entity";
import { AuthModel } from "../frameworks/models/auth.Model";
import { UserModel } from "../frameworks/models/user.Model";
import IAdminRepository from "../interfaces/repositories/IAdmin.repository";

export class AdminRepository implements IAdminRepository {
  async getUsers(page:number) {
    try {
      // Use .lean() to get plain JavaScript objects
      const limit = 10
      const skip = ((page) - 1) * limit
      console.log(skip);
      const totalUsers = await UserModel.countDocuments({});
      const users = await UserModel.find({}).skip(skip).limit(limit)
      console.log(users);
      
      return {users,totalUsers} 
    } catch (error) {
      throw error;
    }
  }
async blockUser(email:string): Promise<boolean> {
    try {
      const updated=await UserModel.findOneAndUpdate({email:email},{$set:{isBlocked:true}})
      console.log(updated);
      return true
    } catch (error) {
      throw error
    }
}
async unblockUser(email:string): Promise<boolean> {
  try {
    const updated=await UserModel.findOneAndUpdate({email:email},{$set:{isBlocked:false}})
    console.log(updated);
    return true
  } catch (error) {
    throw error
  }
}

  
}
