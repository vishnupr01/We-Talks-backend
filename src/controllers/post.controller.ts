import { NextFunction, Response, Request } from "express";
import IPost from "../entities/post.entity";
import IUser from "../entities/user.entity";
import { IPostUseCase } from "../interfaces/usecase/IPost.useCase";
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import { JwtPayload } from '../interfaces/usecase/IUser.usecase'
export class PostController {
  private postUseCase: IPostUseCase
  constructor(postUseCase: IPostUseCase) {
    this.postUseCase = postUseCase
  }

  async createPost(req: AuthenticatedRequest, res: Response, next: NextFunction) {

    try {
      const user = req.user as JwtPayload
      const images = req.body.images
      const caption = req.body.caption.trim()
      const location = req.body.location





      if (!user || !images || !caption) {

        return res.status(400).json({ status: "fail", message: "Missing required fields" });
      }

      const data: IPost = {
        _id: '',
        creator_id: user.id,
        caption: caption,
        images: images,
        location: location,
        liked: [''],
        likes: 0,
        savedUser: []
      }


      const postCreated = await this.postUseCase.createPost(data)


      res.status(201).json({ status: "success", data: postCreated })
    } catch (error) {


      throw new Error("post failed")
    }

  }
  async getAllPosts(req: Request, res: Response, next: NextFunction) {
    const page: any = req.query.page || 1
    console.log("in controller", page);

    const limit = 4
    const skip = ((page) - 1) * limit
    console.log(skip);

    try {
      const allPosts = await this.postUseCase.getPosts(skip, limit)
      console.log("hoooodfd", allPosts);
      res.status(201).json({ status: "success", data: allPosts })

    } catch (error) {
      console.log("error in controller", error);
      throw error

    }
  }
  async singlePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {

      const { postId } = req.query
      const user = req.user as JwtPayload
      const userId = user.id
      const response = await this.postUseCase.getSinglePostDetail(postId as string, userId)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }

  }
  async saveCaption(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId, caption } = req.body
      const response = await this.postUseCase.editCaption(postId, caption)
      console.log("caption res", response);

      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.query
      const response = await this.postUseCase.deletePost(postId as string)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async CheckLike(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { postId } = req.body



      const result = await this.postUseCase.isLiked(postId, userId)


      res.status(201).json({ status: "success", data: result })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async getLikedPosts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const response = await this.postUseCase.getLiked(userId)
      res.status(201).json({ status: "success", data: response })

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async savePost(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { postId } = req.body
      const response = await this.postUseCase.isSaved(postId, userId)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async postsSaved(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      console.log("reaching savedPost");

      const user = req.user as JwtPayload
      const userId = user.id
      const response = await this.postUseCase.getAllSavedPosts(userId)
      console.log("saved post in controller", response);

      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })
    }
  }
  async newReport(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const reporter_id = user.id
      const { post_id, description } = req.body
      console.log("controller for report",post_id);
      
      const response = await this.postUseCase.createReport(post_id, reporter_id, description)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })

    }
  }
}

