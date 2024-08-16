import { Request,Response,NextFunction } from 'express'
import { JwtPayload } from '../../interfaces/usecase/IUser.usecase'
import { verifyJWT } from '../utils/jwt.token'
import { IJwtPayloadAdmin } from '../../entities/admin.entity'


export interface AuthenticatedRequest extends Request{
  admin?:IJwtPayloadAdmin
} 
export const AdminMiddleware=async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
  try {
    const AdminToken=req.cookies.adminToken
    if(!AdminToken){
      return res.status(200).json({message:"not authenticated"})
    }
    console.log("authtoken reached",AdminToken);
    
    const AdminData=verifyJWT(AdminToken) as IJwtPayloadAdmin
    console.log("hey",AdminData);
    
    if(!AdminData){
      return res.status(200).json({message:"Unauthorized"})
    }
   
    
    req.admin=AdminData
    next()
  } catch (error:any) {
  throw error
    
  }

}