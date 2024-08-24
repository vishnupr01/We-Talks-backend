import express,{NextFunction,Request,Response} from 'express'
import IAuth from '../../entities/auth.entity'
import IUser from '../../entities/user.entity'
import { AuthController } from '../../controllers/auth.controller'
import { AuthRepository } from '../../repository/auth.repository'
import { AuthUsecase } from '../../usecase/auth.useCase'
import { authMiddleware, blockMiddleware } from '../middlewares/authmiddlewares'

const router=express.Router()
const authRepository=new AuthRepository()
const authUsecase=new AuthUsecase(authRepository)
const authController=new AuthController(authUsecase)

router.post('/signup',(req:Request,res:Response,next:NextFunction)=>{
  authController.signup(req,res,next)

})
router.post('/resend',(req:Request,res:Response,next:NextFunction)=>{
authController.resendOtp(req,res,next)
})
router.post('/verifyOtp',(req:Request,res:Response,next:NextFunction)=>{
authController.verifyOtp(req,res,next)
})
router.post('/signIn',(req:Request,res:Response,next:NextFunction)=>{
  authController.signin(req,res,next)
})
router.get('/verifyToken',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{ 
  console.log("entering...");
  
  authController.isUser(req,res,next)
})
router.post('/logout',(req:Request,res:Response,next:NextFunction)=>{
  authController.logOut(req,res,next)
})
router.post('/google',(req:Request,res:Response,next:NextFunction)=>{
  authController.googleSignup(req,res,next)
})
router.patch('/googleUpdate',(req:Request,res:Response,next:NextFunction)=>{
  authController.googleUpdateData(req,res,next)
})
router.get('/isBlocked',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  console.log("hey");
  
  authController.isBlocked(req,res,next)
})
router.post('/forgotOtp',(req:Request,res:Response,next:NextFunction)=>{
  authController.forgotOtp(req,res,next)
})
router.patch('/changePass',(req:Request,res:Response,next:NextFunction)=>{
  authController.changePassword(req,res,next) 
})
router.get('/getToken',(req:Request,res:Response,next:NextFunction)=>{
   authController.getToken(req,res,next)
})
router.post('/refreshToken',(req:Request,res:Response,next:NextFunction)=>{
  authController.newToken(req,res,next)
})
 
export default router