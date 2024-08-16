import { Request,Response,NextFunction } from 'express'
import { JwtPayload } from '../../interfaces/usecase/IUser.usecase'
import { verifyJWT } from '../utils/jwt.token'
import { UserModel } from '../models/user.Model'

export interface AuthenticatedRequest extends Request{
  user?:JwtPayload
} 
export const authMiddleware=async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
  try {
    const authToken=req.cookies.authToken
    if(!authToken){
      return res.status(200).json({message:"not authenticated"})
    }
    console.log("authtoken reached",authToken);
    
    const userData=verifyJWT(authToken) as JwtPayload
    console.log("hey",userData);
    
    if(!userData){
      return res.status(200).json({message:"Unauthorized"})
    }
    const user=await UserModel.findById(userData.id)
    console.log("userhhhh",user);
    
    if(!user){
      return res.status(404).json({message:'user not found'})
    }
    if(user.isBlocked){
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
      });
      return res.status(400).json({ message: "User is blocked" });
    }
    req.user=userData
    next()
  } catch (error:any) {
    if (error.message === 'TokenExpired') {
      return res.status(401).json({ message: 'Token expired' });
    } else if (error.message === 'InvalidToken') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(500).json({ message: 'Server error' });
    }
    
  }

}
export const blockMiddleware=async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
  try {
    const authToken=req.cookies.authtoken
    if(!authToken){
      return res.status(200).json({message:"not authenticated"})
    }
    const userData=verifyJWT(authToken) as JwtPayload
    console.log("hey",userData);
    
    if(!userData){
      return res.status(200).json({message:"Unauthorized"})
    }
    const user=await UserModel.findById(userData.id)
    console.log("user",user);
    
    if(!user || user.isBlocked){
      return res.status(404).json({message:'user not found'})
    }
    next()
    
  } catch (error) {
    throw error

  }

}