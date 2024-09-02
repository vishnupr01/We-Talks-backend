import express, { NextFunction, Request, Response } from 'express'
import { RoomController } from '../../controllers/room.controller';
import { authMiddleware } from '../middlewares/authmiddlewares';
import { RoomUseCase } from '../../usecase/room.useCase';
const roomUsecase=new RoomUseCase()
const roomController = new RoomController(roomUsecase)
const router = express.Router()

router.get('/enterRoom', (req: Request, res: Response, next: NextFunction) => {
  console.log("reaching load route");
  roomController.enterRoom(req, res, next)
})
router.get('/getToken',authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  roomController.getToken(req, res, next)
})
router.post('/spaceRequest',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  roomController.invitaionForSpace(req,res,next)
})
router.post('/declineInvite',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  roomController.invitationDeclined(req,res,next)
})
export default router