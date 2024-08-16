import express, { NextFunction, Request, Response } from 'express'
import { CommentRepository } from '../../repository/comment.repository'
import { CommentUseCase } from '../../usecase/comment.usecase'
import { CommentController } from '../../controllers/comment.controller'
import { authMiddleware } from '../middlewares/authmiddlewares'
import { UserRepository } from '../../repository/user.repository'
import { PostRepository } from '../../repository/post.repository'
import { NotificationRepository } from '../../repository/notification.repository'

const router = express.Router()
const commentRepository = new CommentRepository()
const userRepository = new UserRepository()
const postRepository = new PostRepository()
const notificationRepository = new NotificationRepository()
const commentUseCase = new CommentUseCase(commentRepository, userRepository, postRepository, notificationRepository)
const commentController = new CommentController(commentUseCase)

router.post('/createComment', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  commentController.createComment(req, res, next)
})
router.get('/getAllComments', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  commentController.postComments(req, res, next)
})
router.post('/replyComment', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  commentController.replyComment(req, res, next)
})
router.get('/commentReplies', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  commentController.commentReplies(req, res, next)
})
router.patch('/likeComment', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  commentController.CheckCommentIsLiked(req, res, next)
})
export default router 
