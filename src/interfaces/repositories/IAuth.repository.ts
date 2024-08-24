import IUser from "../../entities/user.entity"
import IAuth from "../../entities/auth.entity"

export interface IAuthRepository{
  checkEmailExists(email:string): Promise<Boolean>
  checkUsernameExists(userName:string):Promise<Boolean>
  createUser(data:IUser):Promise<IUser>
  saveOtp(email:string,otp:string):Promise<string>
  verifyOtp(email:string,otp:string):Promise<string>
  verifyUser(email:string):Promise<IAuth | null>
 emailAuth(email: string): Promise<{ user: IUser; auth: IAuth }>;
  checkUserVerified(email:string):Promise<boolean>
  tokenSave(data: IAuth, token: string,refreshToken:string): Promise<{token:string,refreshToken:string}>
  profileImage(id:string):Promise<string> 
  googleUser(data: IUser): Promise<IUser>
  updateGoogle(_id:string,userName:string,dob:Date):Promise<any>
  isBlocked(email:string):Promise<Boolean>
  changePassword(email: string, newPassword: string):Promise<any>
 
}