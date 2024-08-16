
import { NextFunction, Response, Request } from "express";
import { ICommentUseCase } from "../interfaces/usecase/IComment.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import { JwtPayload } from "jsonwebtoken";

export class CommentController {
  private commentUseCase: ICommentUseCase
  constructor(commentUseCase: ICommentUseCase) {
    this.commentUseCase = commentUseCase
  }
  async createComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user?.id
      const { postId, text } = req.body
      console.log(postId);
      console.log(text);

      const response = await this.commentUseCase.newComment(postId, userId, text)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message })
    }
  }

  async postComments(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId, page } = req.query
      const limit = 5
      const pages: any = page
      const skip = ((pages) - 1) * limit
      console.log("s", skip);
      console.log("l", limit);
      console.log("p", page);
      const response = await this.commentUseCase.allComments(postId as string, skip, limit)
      console.log("commetn", response);

      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message })

    }
  }
  async replyComment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user?.id
      const { replayTo, newComment } = req.body
      console.log("details", replayTo, newComment, userId);

      const response = await this.commentUseCase.commentReply(replayTo, userId, newComment)

      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async commentReplies(req: Request, res: Response, next: NextFunction) {
    try {
      const { commentId } = req.query
      const response = await this.commentUseCase.getAllReplies(commentId as string)
      res.status(201).json({ status: "success", data: response })

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }

  }
  async CheckCommentIsLiked(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userId = user.id
      const { commentId } = req.body

      const result = await this.commentUseCase.islikedComment(commentId, userId)

      res.status(201).json({ status: "success", data: result })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }


}