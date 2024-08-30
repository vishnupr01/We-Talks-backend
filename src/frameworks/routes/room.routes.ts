import express, { NextFunction, Request, Response } from 'express'
import { RoomController } from '../../controllers/room.controller';
import { authMiddleware } from '../middlewares/authmiddlewares';
const roomController = new RoomController()
const router = express.Router()

router.get('/enterRoom', (req: Request, res: Response, next: NextFunction) => {
  console.log("reaching load route");
  roomController.enterRoom(req, res, next)
})
router.get('/getToken',authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  roomController.getToken(req, res, next)
})
export default router