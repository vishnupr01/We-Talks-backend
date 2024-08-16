import { IAdmin } from "../../entities/admin.entity";
import IAuth from "../../entities/auth.entity";
export default interface IAdminRepository{
  getUsers(page:number):Promise<any>
  blockUser(email:string):Promise<boolean>
  unblockUser(email:string):Promise<boolean>
  
}