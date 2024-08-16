import { IAdmin,IAdminLogin } from "../../entities/admin.entity";
import { Request } from "express";
export default interface IAdminUseCase{
  adminLogin(email:string,password:string):Promise<boolean>
  getAllUsers(page:number):Promise<any>
  blockingUser(email:string):Promise<boolean>
  unBlockingUser(email:string):Promise<boolean>

}
export interface BlockRequest extends Request{

}