
import IAuth from "../../entities/auth.entity"
import IUser from "../../entities/user.entity"

export interface IAuthUsecase{
userSignin(data:IAuth):any
userSignup(data:IUser):any
resendOtp(email:string,subject:string):any
verifyOtp(email:string,otp:string):any
googleSignup(data: IUser):any
googleUpdate(_id: string, userName: string, dob: Date): Promise<any> 
isBlocked(_id:string):Promise<Boolean>
checkUser(email: string): Promise<Boolean>
forgotPassword(email: string, newPassword: string): Promise<Boolean>


}
