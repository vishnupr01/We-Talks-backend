import mongoose, { ObjectId } from "mongoose";
import INotification from "../entities/notification.entity";
import IPost from "../entities/post.entity";
import IUser from "../entities/user.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinary";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IPostUseCase } from "../interfaces/usecase/IPost.useCase";
import INotificationRepository from "../interfaces/repositories/INotification.repository";
import { NOTIFICATION_TYPE } from "../enums/notification";
import { getRecieverId } from "../frameworks/configs/socketioHandlers";
import { io } from "../server";
import { IReport } from "../entities/report.entity";

export class PostUseCase implements IPostUseCase {
  private postRepository: IPostRepository
  private cloudinaryService: CloudinaryService
  private userRepository: IUserRepository
  private notificationRepository: INotificationRepository
  constructor(
    postRepository: IPostRepository,
    cloudinaryService: CloudinaryService,
    userRepository: IUserRepository,
    notificationRepostitory: INotificationRepository

  ) {
    this.postRepository = postRepository
    this.cloudinaryService = cloudinaryService
    this.userRepository = userRepository
    this.notificationRepository = notificationRepostitory
  }
  async createPost(data: IPost): Promise<IPost> {
    try {

      const uploadImages = await Promise.all(
        data.images.map((image) => this.cloudinaryService.uploadImage(image)
        ))
      data.images = uploadImages

      const createdPost = await this.postRepository.postCreate(data)
      return createdPost

    } catch (error) {
      console.log(error, "error in useCase");

      throw new Error("Post is Failed")
    }
  }

  async getPosts(skip: any, limit: any): Promise<IPost[]> {
    try {
      const posts = await this.postRepository.loadPosts(skip, limit)
      return posts
    } catch (error) {
      console.log("error found on useCase", error);
      throw error
    }

  }

  async getSinglePostDetail(postId: string, _id: string): Promise<IPost[]> {
    try {
      if (!postId || !_id) {
        throw new Error("credentials are missing")
      }
      const postDetails = await this.postRepository.getPostDetails(postId)
      return postDetails

    } catch (error) {
      throw error
    }
  }

  async editCaption(postId: string, caption: string): Promise<IPost> {
    try {
      if (!postId || !caption) {
        throw new Error("caption is missing")
      }
      const savedCaption = await this.postRepository.postCaption(postId, caption)
      return savedCaption

    } catch (error) {
      throw error
    }
  }
  async deletePost(postId: string): Promise<IPost | null> {
    try {
      if (!postId) {
        throw new Error("Credential error")
      }
      const deletePost = await this.postRepository.postDelete(postId)
      return deletePost as IPost | null
    } catch (error) {
      throw error
    }
  }
  async isLiked(postId: string, userId: string): Promise<IPost | null> {
    try {

      const post: IPost = await this.postRepository.Post(postId, userId)
      if (!post) {
        throw new Error('post not found')
      }
      if (post.liked.includes(userId)) {
        return this.postRepository.unlikePost(postId, userId)
      } else {
        const sender: any = await this.userRepository.currentUser(userId)
        const getPost: IPost[] = await this.postRepository.getPostDetails(postId)
        const receiverId = new mongoose.Types.ObjectId(getPost[0].creator_id)
        const post_Id = new mongoose.Types.ObjectId(getPost[0]._id)
        console.log("sender", sender._id);
        console.log("receiver", getPost[0].creator_id);

        if (String(sender._id) === String(getPost[0].creator_id)) {
          console.log("working self");
          return this.postRepository.likePost(postId, userId)
        }
        const data: INotification = {
          sender: sender._id,
          receiver: receiverId,
          type: NOTIFICATION_TYPE.POSTLIKE,
          message: `${sender.userName} liked your post`,
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

        return this.postRepository.likePost(postId, userId)
      }


    } catch (error) {
      console.log(error);

      throw error
    }
  }

  async getLiked(userId: string): Promise<IPost[]> {
    try {
      if (!userId) {
        throw new Error("credentials error")
      }
      const liked = await this.postRepository.getLikedPosts(userId)
      return liked

    } catch (error) {
      throw error
    }
  }

  async isSaved(postId: string, userId: string): Promise<IUser | null> {
    try {

      const User: IUser | null = await this.userRepository.currentUser(userId)
      if (!User) {
        throw new Error('user not found')
      }
      if (User.saved.includes(postId)) {
        return this.postRepository.unSavePost(postId, userId)
      } else {
        return this.postRepository.savePost(postId, userId)
      }


    } catch (error) {
      throw error
    }
  }
  async getAllSavedPosts(user_id: string): Promise<IPost[]> {
    try {
      if (!user_id) {
        throw new Error("credential are missing")

      }
      const savedPosts = await this.postRepository.savedPosts(user_id)
      return savedPosts

    } catch (error) {
      throw error

    }
  }
  async createReport(post_id: string, reporter_id: string, description: string): Promise<IReport|string> {
    try {
      if (!post_id || !reporter_id || !description) {
        throw new Error("credential server error")
      }
      const isExist = await this.postRepository.existingReport(post_id, reporter_id)
      if (isExist) return "report exists"
      const response = await this.postRepository.createReport(post_id, reporter_id, description)
      return response
    } catch (error) {
      throw error
    }
  }

}