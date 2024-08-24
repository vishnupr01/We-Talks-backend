import IAuth from "../entities/auth.entity";
import IUser from "../entities/user.entity";
import { IAuthUsecase } from "../interfaces/usecase/IAuth.usecase";
import { IAuthRepository } from "../interfaces/repositories/IAuth.repository";
import bcrypt from 'bcrypt'
import { generateOTP } from "../frameworks/utils/generateOtp";
import { sendEmail } from "../frameworks/utils/sendEmail";
import { comparePassword } from "../frameworks/utils/bcrypt"
import { createJWT, createRefreshToken } from "../frameworks/utils/jwt.token";
import { ErrorCode } from "../enums/errorCodes";

export class AuthUsecase implements IAuthUsecase {
  private authRepository: IAuthRepository;  
  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository
  }


  async resendOtp(email: string, subject: string) {
    this.sendOtp(email, subject)
  }

  async sendOtp(email: string, subject: string) {
    try {
      const otp = generateOTP(4)
      console.log("otp mail",email)
      console.log(otp)
      await this.authRepository.saveOtp(email, otp)
      await sendEmail(email, subject, `your otp is ${otp}`)


      return
    } catch (error) {
      throw new Error('otp sending failed')

    }

  }


  async userSignup(data: IUser) {
    try {
      console.log("use", data);

      const emailExists = await this.authRepository.checkEmailExists(data.email)
      const userExists = await this.authRepository.checkUsernameExists(data.userName)
      const BirthDate = new Date()
      BirthDate.setFullYear(BirthDate.getFullYear() - 16)
      console.log(BirthDate);
      const currenDate = new Date(data.dob.toString())
      if (currenDate >= BirthDate) {
        throw new Error("enter the correct date")
      }
      if (emailExists) {
        console.log("email exists");

        throw new Error(ErrorCode.Email_ALREADY_EXISTS);
      }
      if (userExists) {
        console.log("username error");

        throw new Error("userName already exists")

      }
      console.log("before", data.password);

      data.password = await bcrypt.hash(data.password, 10)
      console.log("after", data.password);
      const newUser = await this.authRepository.createUser(data)
      await this.sendOtp(data.email, "otp for WETALKS")

      return newUser
    } catch (error) {

      throw error


    }

  }
  async googleSignup(data: IUser) {
    try {
      console.log("use", data);

      const emailExists = await this.authRepository.checkEmailExists(data.email)
      const userExists = await this.authRepository.checkUsernameExists(data.userName)
      
      if (emailExists) {
        console.log("hey iam here");
        const response = await this.authRepository.emailAuth(data.email)
        const user=response.user
        if(response.auth.verified){
          const payload = { id: user._id, name: user.name, email: user.email, image_url: user.profileImg,isBloced:user.isBlocked }
          const token = createJWT(payload, 5)
          return { status: "gooogle", user: response.user,auth:response.auth,token:token }
        }
        return { status: "gooogle", user: response.user,auth:response.auth}
      }
      const newUser = await this.authRepository.googleUser(data)

      return newUser
    } catch (error) {

      throw error


    }

  }
  async verifyOtp(email: string, otp: string) {
    try {
      const OtpVerification = await this.authRepository.verifyOtp(email, otp)
      await this.authRepository.verifyUser(email)
      console.log(OtpVerification);

      return OtpVerification
    } catch (error) {
      console.log(error);
      throw error

    }
  }
  async userSignin(data: IAuth) {
    const response = await this.authRepository.emailAuth(data.email)
    const isMatch = await comparePassword(data.password, response.auth.password)
   

    if (!isMatch) {
      throw new Error(ErrorCode.PASSWORD_INCORRECT)
    }
    const isUserVerified = await this.authRepository.checkUserVerified(data.email)
    const isBlocked=await this.authRepository.isBlocked(data.email)
    if(isBlocked){
      return "user is Blocked"
    }
    if (!isUserVerified) {
      const token = "user is not verified"
      await this.sendOtp(data.email, "OTP for WETALKS")
      return token
      // throw new Error("user not verified")
    }

     const user=response.user
    const payload = { id: user._id, name: user.name, email: user.email,  image_url: user.profileImg,isBlocked:user.isBlocked }
    const token = createJWT(payload, 5)
    const refreshToken=createRefreshToken(payload)
    console.log("refreshToken:",refreshToken);
    
    return await this.authRepository.tokenSave(data, token,refreshToken )
  }


  async googleUpdate(_id: string, userName: string, dob: Date): Promise<any> {
    try {
      const BirthDate = new Date()
      console.log(typeof(dob));
      
      BirthDate.setFullYear(BirthDate.getFullYear() - 16)
      console.log(BirthDate);
      console.log("hey",dob);
      
      const currenDate = new Date(dob.toString())
      if (currenDate >= BirthDate) { 
        throw new Error("enter the correct date")
      }
       const userNameExists=await this.authRepository.checkUsernameExists(userName)
       if(userNameExists){
        throw new Error("userName already taken")
       }
      const response = await this.authRepository.updateGoogle(_id, userName, dob)
      if (!response) {
        throw new Error("unable to Update")
      }
      return response
    }
    catch (error) {
      throw error
    }


  }
  async isBlocked(_id:string):Promise<Boolean>{
    try {
      const response=await this.authRepository.isBlocked(_id)
      return response
    } catch (error) {
      throw error
    }
  }
  async checkUser(email: string): Promise<Boolean> {
    try {
      const result =await  this.authRepository.checkEmailExists(email)
      console.log("whatttt",result);
      
      if(!result){
        throw new Error("User not found")
      }
      return result
    } catch (error) {
      throw error
    }
  }
  async forgotPassword(email: string, newPassword: string): Promise<Boolean> {
    try {
      if(!email ||!newPassword){
        throw new Error("credentials are required")
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await this.authRepository.changePassword(email, hashedPassword);
      console.log("forgot update",result);
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error("Error updating password:", error);
      throw new Error("Failed to update password");
    }
  }

}