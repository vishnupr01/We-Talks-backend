import express, { NextFunction, Request, Response } from 'express'
import { MessageRepository } from '../../repository/messages.repository'
import { MessageUseCase } from '../../usecase/message.useCase'
import { MessageController } from '../../controllers/messages.controller'
import { authMiddleware } from '../middlewares/authmiddlewares'

const router = express.Router()

const messageRepository = new MessageRepository()
const messageUseCase = new MessageUseCase(messageRepository)
const messageController = new MessageController(messageUseCase)
console.log("hey");

router.post('/sendMessage',authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  messageController.sendMessage(req, res, next) 
})
router.get('/getMessage',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  messageController.getAllMessages(req,res,next)
})
router.get('/getConversations',authMiddleware,(req:Request,res:Response,next:NextFunction)=>{
  messageController.getAllConversations(req,res,next)
})

export default router