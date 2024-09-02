import express, { NextFunction, Request, Response } from 'express'
import AdminController from '../../controllers/admin.controller'
import { AdminRepository } from '../../repository/admin.repository'
import { AdminUsecase } from '../../usecase/admin.useCase'
import { AdminMiddleware } from '../middlewares/adminmidleware'
import { UserUseCase } from '../../usecase/user.useCase'
import { UserRepository } from '../../repository/user.repository'
import { CloudinaryService } from '../utils/cloudinary'
import { AuthRepository } from '../../repository/auth.repository'
import { PostRepository } from '../../repository/post.repository'
import { PostUseCase } from '../../usecase/post.useCase'
import { NotificationRepository } from '../../repository/notification.repository'
const router = express.Router()

const userRepository = new UserRepository
const authRepository = new AuthRepository()
const cloudinaryService = new CloudinaryService()
const userUseCase = new UserUseCase(userRepository, authRepository, cloudinaryService)
const postRepository = new PostRepository()
const notificationRepository = new NotificationRepository()
const postUsecase = new PostUseCase(postRepository, cloudinaryService, userRepository, notificationRepository)
const adminRepository = new AdminRepository()
const adminUsecase = new AdminUsecase(adminRepository, postRepository)
const adminController = new AdminController(adminUsecase, userUseCase, postUsecase)


router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  adminController.login(req, res, next)
})
router.get('/isAdmin', AdminMiddleware, (req: Request, res: Response, next: NextFunction) => {
  adminController.isAdmin(req, res, next)
})
router.get('/getUsers', (req: Request, res: Response, next: NextFunction) => {
  adminController.loadUsers(req, res, next)
})
router.patch('/blockUser', (req: Request, res: Response, next: NextFunction) => {
  adminController.userBlock(req, res, next)
})
router.patch('/unBlockuser', (req: Request, res: Response, next: NextFunction) => {
  console.log("route reached");

  adminController.userUnBlock(req, res, next)
})
router.get('/getUserProfile/:userId', (req: Request, res: Response, next: NextFunction) => {
  adminController.getUserProfile(req, res, next)
})
router.delete('/deleteAdminPost', (req: Request, res: Response, next: NextFunction) => {
  adminController.deleteAdminPost(req, res, next)
})

router.get('/dayDetails', (req: Request, res: Response, next: NextFunction) => {
  adminController.detailsDay(req, res, next)
})
router.get('/monthDetails', (req: Request, res: Response, next: NextFunction) => {
  adminController.detailsMonth(req, res, next);
});
router.get('/yearDetails', (req: Request, res: Response, next: NextFunction) => {
  adminController.detailsYear(req, res, next);
});
router.get('/totalData', (req: Request, res: Response, next: NextFunction) => {
  adminController.totalDetails(req, res, next)
})
router.get('/getReports', (req: Request, res: Response, next: NextFunction) => {
  adminController.getAllReports(req, res, next)
})
router.get('/postManage', (req: Request, res: Response, next: NextFunction) => {
  adminController.getSinglePostDetail(req, res, next)
})

router.patch('/blockPost', (req: Request, res: Response, next: NextFunction) => {
  adminController.blockPost(req, res, next);
});


router.patch('/unblockPost', (req: Request, res: Response, next: NextFunction) => {
  adminController.unblockPost(req, res, next);
});

router.get('/blockedPosts', (req: Request, res: Response, next: NextFunction) => {
  adminController.getAllBlockedPosts(req, res, next);
});
export default router