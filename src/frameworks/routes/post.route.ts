import express, { NextFunction, Request, Response } from 'express'
import { PostRepository } from '../../repository/post.repository'
import { PostController } from '../../controllers/post.controller'
import { PostUseCase } from '../../usecase/post.useCase'
import { CloudinaryService } from '../utils/cloudinary'
import { authMiddleware } from '../middlewares/authmiddlewares'
import { UserRepository } from '../../repository/user.repository'
import { NotificationRepository } from '../../repository/notification.repository'

const router = express.Router()
const postRepository = new PostRepository
const cloudinaryService = new CloudinaryService
const userRepository = new UserRepository()
const notificationRepository = new NotificationRepository()
const postUseCase = new PostUseCase(postRepository, cloudinaryService, userRepository, notificationRepository)
const postController = new PostController(postUseCase)

router.post('/createPost', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.createPost(req, res, next)
})
router.get('/loadAllPosts', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      console.log("reaching load route");

      postController.getAllPosts(req, res, next)
})
router.get('/singlePost', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.singlePost(req, res, next)
})
router.patch('/saveCaption', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.saveCaption(req, res, next)
})
router.delete('/deletePost', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.deletePost(req, res, next)
})
router.patch('/likePost', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.CheckLike(req, res, next)
})
router.get('/getLiked', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.getLikedPosts(req, res, next)
})
router.patch('/savePost', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.savePost(req, res, next)
})
router.get('/savedPosts', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.postsSaved(req, res, next)
})
router.post('/reportPost', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
      postController.newReport(req, res, next)
})


export default router
