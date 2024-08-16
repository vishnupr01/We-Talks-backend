import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import IMessageUseCase from "../interfaces/usecase/IMessage.usecase";
import { NextFunction, Response, Request } from "express";

export class MessageController {
  private messageUseCase: IMessageUseCase
  constructor(messageUseCase: IMessageUseCase) {
    this.messageUseCase = messageUseCase
  }

  async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { message, recieverIds } = req.body

      const user = req.user as JwtPayload 
      const senderId = user?.id

      const newMessage = await this.messageUseCase.sendMessage(senderId, recieverIds, message)
      res.status(201).json({ status: "success", data: newMessage })

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    } 


  }
  async getAllMessages(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const senderId = user?.id
      const { receiverId } = req.query
      const response = await this.messageUseCase.allMessages(senderId, receiverId as string)

      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async getAllConversations(req:AuthenticatedRequest,res:Response,next:NextFunction){
    try {
      const user = req.user as JwtPayload
      const senderId = user?.id
      
      const response=await this.messageUseCase.getUserConversations(senderId)

      res.status(201).json({ status: "success", data: response })
    } catch (error:any) {
      res.status(400).json({ message: error.message })
      
    }

  }
}