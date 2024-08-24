import { IAuthRepository } from "../interfaces/repositories/IAuth.repository";
import { AuthModel } from "../frameworks/models/auth.Model";
import { UserModel } from "../frameworks/models/user.Model";
import IUser from "../entities/user.entity";
import { OtpModel } from "../frameworks/models/otp.Model";
import IAuth from "../entities/auth.entity";



export class AuthRepository implements IAuthRepository {

  async checkUsernameExists(userName: string): Promise<Boolean> {
    const user = await AuthModel.findOne({ userName: userName })
    return user !== null
  }
  async checkEmailExists(email: string): Promise<Boolean> {
    const user = await AuthModel.findOne({ email: email })
  
    return user !== null
  }
  async createUser(data: IUser): Promise<IUser> {
    try {
      console.log("helloooo", data.name);
      console.log(data.userName);
  
   
      const user = new UserModel({
        email: data.email,
        userName: data.userName,
        name: data.name,
        dob: data.dob
      })
  
      const newAuth = new AuthModel({
        email: data.email,
        userName: data.userName,
        name: data.name,
        password: data.password,
        userid: user.id
  
      })
      const savedUser = await user.save()
      const savedAuth = await newAuth.save()
  
      console.log("saved", savedUser);
  
      const createdUser: IUser = savedUser.toObject()
      return createdUser
      
    } catch (error) {
      throw error
    }
   
  }
  async googleUser(data: IUser): Promise<IUser> {
    const user = new UserModel({
      email: data.email,
      userName:data.name,
      name: data.name,


    })

    const newAuth = new AuthModel({
      email: data.email,
      userName: data.name,
      name: data.name,
      userid: user.id

    })
    const savedUser = await user.save()
    const savedAuth = await newAuth.save()

    console.log("saved", savedUser);

    const createdUser: IUser = savedUser.toObject()
    return createdUser
  }
  async saveOtp(email: string, otp: string): Promise<string> {
    try {
      const expiry = new Date()
      expiry.setTime(expiry.getTime() + 5 * 60 * 1000);
      const newOtp = new OtpModel({
        email: email,
        otp: otp,
        expiry: expiry
      })
      await newOtp.save()
      return otp

    } catch (error) {
      throw new Error("Error found in otp")
    }
  }
  async verifyOtp(email: string, otp: string): Promise<string> {
    try {
      const otpFound = await OtpModel.findOne({ email: email, otp: otp }).sort({ expiry: -1 })
      if (!otpFound) {
        throw new Error("Invalid otp")
      }
      if (!otpFound.expiry || otpFound.expiry < new Date) {
        throw new Error("OTP expired")
      }
      return "OTP verified successfully"
    } catch (error) {
      console.log("error in verifying otp");

      throw error
    }

  }
  async verifyUser(email: string): Promise<IAuth | null> {
    try {
      const updatedUser = await AuthModel.findOneAndUpdate(
        { email: email },
        { $set: { verified: true } },
        { new: true }
      )
      if (updatedUser) {
        return updatedUser.toJSON() as IAuth
      } else {
        return null
      }
    } catch (error) {
      throw error

    }
  }
  async emailAuth(email: string): Promise<{ user: IUser; auth: IAuth }> {
    try {
      const user = await UserModel.findOne({ email: email })
      const auth = await AuthModel.findOne({ email: email })
      if (!user) {
        throw new Error("User not found");
      }
      if (!auth) {
        throw new Error("Auth information not found");
      }
      await UserModel.findOneAndUpdate({ email }, { lastActive: new Date() });
      return {
        user: user.toJSON() as IUser,
        auth: auth.toJSON() as IAuth// Ensure `auth` is included in the response
      };
    } catch (error) {
      throw error
    }

  }
  async checkUserVerified(email: string): Promise<boolean> {
    const user = await AuthModel.findOne({ email: email })
    return user?.verified == true
  }
  async tokenSave(data: IAuth, token: string,refreshToken:string): Promise<{token:string,refreshToken:string}> {
    await AuthModel.updateOne({ email: data.email }, { $push: { token: token } })
    return {token,refreshToken}
  }
  async profileImage(id: string): Promise<string> {
    try {
      const ImageUrl = await UserModel.findById(id)
      console.log("repo", ImageUrl);

      return ImageUrl?.profileImg as string
    } catch (error) {
      console.log(error);
      throw new Error

    }


  }
  async updateGoogle(_id: string, userName: string, dob: Date): Promise<any> {
    try {
      
     
      const updatedData = await UserModel.findByIdAndUpdate({ _id: _id }, { $set: { userName: userName, dob: dob } })
      const authUpdate = await AuthModel.findOneAndUpdate({ userid: _id }, { $set: { userName: userName, verified: true } })
      if (!updatedData) return null
      return updatedData
    } catch (error) {
      throw error

    }

  }

  async isBlocked(email: string): Promise<Boolean> {
    console.log("call for block");

    const response = await UserModel.findOne({ email: email, isBlocked: true })
    return response !== null
  }

  async changePassword(email: string, newPassword: string) {
    return await AuthModel.updateOne(
      { email: email },
      { $set: { password: newPassword } }
    );
  }


}