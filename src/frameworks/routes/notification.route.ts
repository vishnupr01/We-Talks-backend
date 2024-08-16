import express, { NextFunction, Request, Response } from 'express'
import { NotificationRepository } from '../../repository/notification.repository'
import { NotificationUseCase } from '../../usecase/notification.useCase'
import { NotificationController } from '../../controllers/notification.controller'
import { authMiddleware } from '../middlewares/authmiddlewares'

const router = express.Router()
const notificationRepository = new NotificationRepository()
const notificationUseCase = new NotificationUseCase(notificationRepository)
const notificationController = new NotificationController(notificationUseCase)

router.get('/getNotifcations', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  notificationController.allNotifications(req, res, next)

})
router.get('/notificationCount', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  notificationController.getNotificationCount(req, res, next)
})
router.post('/createFriendRequest', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  notificationController.createFriendRequest(req, res, next)
})
router.get('/fetchfriendRequests', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  notificationController.friendRequests(req, res, next)
})
router.patch('/requestAccepted', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  notificationController.acceptRequest(req, res, next)
})
export default router