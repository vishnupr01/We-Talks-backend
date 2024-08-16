import mongoose from "mongoose";
import IComment, { IReply } from "../entities/comment.entity";
import IPost from "../entities/post.entity";
import { ICommentRepository } from "../interfaces/repositories/IComment.repository";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { ICommentUseCase } from "../interfaces/usecase/IComment.usecase";
import INotification from "../entities/notification.entity";
import { NOTIFICATION_TYPE } from "../enums/notification";
import INotificationRepository from "../interfaces/repositories/INotification.repository";
import { getRecieverId } from "../frameworks/configs/socketioHandlers";
import { io } from "../server";
import Comment from "../frameworks/models/comment.model";

export class CommentUseCase implements ICommentUseCase {
  private commentRepository: ICommentRepository
  private userRepository
  private postRepository
  private notificationRepository


  constructor(
    commentRepository: ICommentRepository,
    userRepository: IUserRepository,
    postRepository: IPostRepository,
    notificationRepository: INotificationRepository
  ) {
    this.commentRepository = commentRepository
    this.userRepository = userRepository
    this.postRepository = postRepository
    this.notificationRepository = notificationRepository
  }
  async newComment(postId: string, authorId: string, text: string): Promise<IComment> {
    try {
      if (!postId || !authorId || !text) {
        throw new Error("credential error")
      }
      const result = await this.commentRepository.commentCreate(postId, authorId, text)
      const sender: any = await this.userRepository.currentUser(authorId)
      const getPost: IPost[] = await this.postRepository.getPostDetails(postId)
      const receiverId = new mongoose.Types.ObjectId(getPost[0].creator_id)
      const post_Id = new mongoose.Types.ObjectId(getPost[0]._id)
      const data: INotification = {
        sender: sender._id,
        receiver: receiverId,
        type: NOTIFICATION_TYPE.POSTCOMMENT,
        message: `${sender.userName} commented on your post *${text}* `,
        postId: post_Id

      }
      const notification = await this.notificationRepository.createNotification(data)
      const notificationCount = await this.notificationRepository.notificationCount(getPost[0].creator_id)
      const idString = getPost[0].creator_id.toString();
      const checkId = getRecieverId(idString)
      if (checkId) {
        console.log("entering on socket second");
        console.log(notificationCount);

        io.to(idString).emit("notificationCount", notificationCount)
      }
      console.log(notification);
      return result as IComment


    } catch (error) {
      throw error
    }

  }

  async allComments(postId: string, skip: number, limit: number): Promise<IComment[] | null> {
    try {
      if (!postId) {
        throw new Error("credential error")
      }
      const response = await this.commentRepository.getAllComments(postId, skip, limit)
      return response as IComment[]
    } catch (error) {
      throw error
    }
  }
  async commentReply(commentId: string, userId: string, replyText: string): Promise<IComment | null> {
    try {
      if (!commentId || !userId || !replyText) {
        throw new Error("credential server Error")
      }
      const response = await this.commentRepository.replyComment(commentId, userId, replyText)
      return response

    } catch (error) {
      throw error
    }
  }
  async getAllReplies(commentId: string): Promise<IReply[] | undefined> {
    try {
      if (!commentId) {
        throw new Error("credential server error")
      }
      const response = await this.commentRepository.getReplies(commentId)
      return response
    } catch (error) {
      throw error
    }
  }


  async islikedComment(commentId: string, userId: string): Promise<IComment | null> {
    try {
      if (!commentId || !userId) {
        throw new Error("credential server error")
      }
      const comment: IComment = await this.commentRepository.comment(commentId, userId)
      if (!comment) {
        throw new Error("comment not found")
      }
      if (comment.liked?.includes(userId)) {
        return this.commentRepository.unlikeComment(commentId, userId)
      } else {
        return this.commentRepository.commentLike(commentId, userId)
      }
    } catch (error) {
      throw  error
    }

  }
  // async isLiked(postId: string, userId: string): Promise<IPost | null> {
  //   try {

  //     const post: IPost = await this.postRepository.Post(postId, userId)
  //     if (!post) {
  //       throw new Error('post not found')
  //     }
  //     if (post.liked.includes(userId)) {
  //       return this.postRepository.unlikePost(postId, userId)
  //     } else {
  //       const sender: any = await this.userRepository.currentUser(userId)
  //       const getPost: IPost[] = await this.postRepository.getPostDetails(postId)
  //       const receiverId = new mongoose.Types.ObjectId(getPost[0].creator_id)
  //       const post_Id = new mongoose.Types.ObjectId(getPost[0]._id)
  //       console.log("sender",sender._id);
  //       console.log("receiver",getPost[0].creator_id);

  //       if (String(sender._id) === String(getPost[0].creator_id)) {
  //         console.log("working self");
  //         return this.postRepository.likePost(postId, userId)
  //       }
  //       const data: INotification = {
  //         sender: sender._id,
  //         receiver: receiverId,
  //         type: NOTIFICATION_TYPE.POSTLIKE,
  //         message: `${sender.userName} liked your post`,
  //         postId: post_Id

  //       }
  //       const notification = await this.notificationRepository.createNotification(data)
  //       const notificationCount = await this.notificationRepository.notificationCount(getPost[0].creator_id)
  //       const idString = getPost[0].creator_id.toString();
  //       const checkId = getRecieverId(idString)
  //       if (checkId) {
  //         console.log("entering on socket second");
  //         console.log(notificationCount);

  //         io.to(idString).emit("notificationCount", notificationCount)
  //       }
  //       console.log(notification);

  //       return this.postRepository.likePost(postId, userId)
  //     }


  //   } catch (error) {
  //     console.log(error);

  //     throw error
  //   }
  // }
}