import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import INotificationUseCase from "../interfaces/usecase/INotification.useCase";
import { NextFunction, Response, Request } from "express";

export class NotificationController {
  private notificationUseCase
  constructor(notificationUseCase: INotificationUseCase) {
    this.notificationUseCase = notificationUseCase
  }
  async allNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user?.id
      const response = await this.notificationUseCase.getAllnotification(userId)
      res.status(201).json({ status: "success", data: response })

    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })

    }

  }
  async getNotificationCount(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user?.id
      const response = await this.notificationUseCase.getNotificationCount(userId)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })

    }
  }

  async createFriendRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user?.id
      const { receiverId } = req.body
      const response = await this.notificationUseCase.newFriendRequest(userId, receiverId)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })
    }
  }

  async friendRequests(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user?.id
      const response = await this.notificationUseCase.getAllFriendRequest(userId)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })
    }
  }

  async acceptRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const receiverId = user?.id
      const { senderId,updaterId } = req.body
      console.log("send",senderId);
      
      const response = await this.notificationUseCase.acceptRequest(senderId,receiverId,updaterId)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })
    }
  }
}