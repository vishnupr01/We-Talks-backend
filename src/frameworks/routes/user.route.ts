import express, { Request, Response, NextFunction } from 'express'
import { UserRepository } from '../../repository/user.repository'
import { UserUseCase } from '../../usecase/user.useCase'
import { UserController } from '../../controllers/user.controller'
import { authMiddleware } from '../middlewares/authmiddlewares'
import { AuthRepository } from '../../repository/auth.repository'
import { CloudinaryService } from '../utils/cloudinary'


const router = express.Router()
const userRepository = new UserRepository
const authRepository = new AuthRepository
const cloudinaryService = new CloudinaryService
const userUseCase = new UserUseCase(userRepository, authRepository, cloudinaryService)
const userController = new UserController(userUseCase)

router.get('/getUserProfile', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  console.log("call getting router");

  userController.userProfile(req, res, next)
})
router.patch('/profileUpdate', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.updateProfile(req, res, next)
})
router.patch('/saveProfileImg', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.updateProfileImg(req, res, next)
})
router.get('/friendProfile/:userId', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.friendsProfile(req, res, next)
})
router.get('/searchUsers', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.searchUsers(req, res, next)
})
router.get('/fetchFriends', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.fetchUserFriends(req, res, next)
})
router.patch('/unFriend', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.unFriend(req, res, next)
})
router.get('/searchFriend', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.searchUserFriend(req, res, next)
})
router.patch('/blockUser', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.blockUser(req, res, next)
})
router.patch('/unblockUser', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.unBlockeUser(req, res, next)
})
router.get('/mutualFriends', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.getMutualFriends(req, res, next);
});
router.delete('/deleteRequest/:requestId', authMiddleware, (req: Request, res: Response, next: NextFunction) => {
  userController.deleteFriendRequest(req, res, next);
});



export default router