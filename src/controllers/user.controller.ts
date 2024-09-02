import { JwtPayload } from "jsonwebtoken";
import { IUserUseCase } from "../interfaces/usecase/IUser.usecase";
import { Request, Response, NextFunction } from 'express'
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import IUser from "../entities/user.entity";

export class UserController {
  private userUseCase: IUserUseCase
  constructor(userUseCase: IUserUseCase) {
    this.userUseCase = userUseCase
  }

  async userProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload

      const user_id = user.id
      if (!user_id) {
        res.status(400).json({ message: "user not verified" })
      }
      const response = await this.userUseCase.getUserProfile(user_id)
      if (!response) {
        res.status(400).json({ message: "server error" })
      }


      res.status(200).json({ status: "success", data: response })

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const data = req.body
    const user = req.user as JwtPayload
    const _id = user.id


    try {
      const response = await this.userUseCase.updateProfile(_id, data)


      res.cookie('authToken', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      })

      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {

      res.status(400).json({ message: error.message })

    }

  }
  async updateProfileImg(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const { image } = req.body
      const _id = user.id

      const response = await this.userUseCase.profileImg(_id, image)
      res.cookie('authToken', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      })
      res.status(200).json({ status: "success", data: response })
    } catch (error) {
      throw error
    }

  }

  async friendsProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params

      const response = await this.userUseCase.getUserProfile(userId)

      res.status(200).json({ status: "success", data: response })

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async searchUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = req.query
      
      const response = await this.userUseCase.getSearchUsers(query as string)
      res.status(200).json({ status: "success", data: response })

    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async fetchUserFriends(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const response = await this.userUseCase.userFriends(userId)
      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async unFriend(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { receiverId } = req.body
      const response = await this.userUseCase.removeFriend(userId, receiverId)
      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async searchUserFriend(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { query } = req.query
      const response = await this.userUseCase.searchAFriend(userId, query as string)
      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async blockUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { blockId } = req.body
      const response = await this.userUseCase.blockUser(userId, blockId as string)
      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(500).json({ message: error.message })
    }
  }

  async unBlockeUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { blockId } = req.body
      const response = await this.userUseCase.unBlockFriend(userId, blockId)
      res.status(200).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async getMutualFriends(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload;
      const userId = user.id;

      const mutualFriends = await this.userUseCase.getMutualFriends(userId);
      console.log("controller mutual",mutualFriends);
      
      res.status(200).json({ status: "success", data: mutualFriends });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async deleteFriendRequest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { requestId } = req.params;
      if (!requestId) {
        return res.status(400).json({ message: "Request ID is required" });
      }

      const wasDeleted = await this.userUseCase.deleteFriendRequestById(requestId);
      if (wasDeleted) {
        return res.status(200).json({ status: "success", message: "Friend request deleted successfully" });
      } else {
        return res.status(404).json({ status: "fail", message: "Friend request not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}