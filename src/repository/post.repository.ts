import mongoose from "mongoose";
import IPost from "../entities/post.entity";
import { PostModel } from "../frameworks/models/post.model";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import IUser from "../entities/user.entity";
import { UserModel } from "../frameworks/models/user.Model";
import { reportModel } from "../frameworks/models/report.Model";
import { IReport } from "../entities/report.entity";
export class PostRepository implements IPostRepository {
  async postCreate(data: IPost): Promise<IPost> {
    try {
      const post = new PostModel({
        creator_id: data.creator_id,
        caption: data.caption,
        images: data.images,
        place: data.location
      })
      const savedPost = await post.save()
      return savedPost

    } catch (error) {
      throw error
    }
  }

  async loadPosts(skip: any, limit: any): Promise<IPost[]> {
    try {
      console.log(skip),
        console.log(limit);


      // const Response=await PostModel.find({}).sort({createdAt:-1}).skip(skip).limit(limit).exec()
      const Response = await PostModel.aggregate([
        {
          $match: {
            blocked: false  // Add this match stage to filter out blocked posts
          }
        },
        {
        $lookup: {
          from: 'users',
          localField: 'creator_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          creator_id: 1,
          caption: 1,
          place: 1,
          images: 1,
          liked: 1,
          createdAt: 1,
          updatedAt: 1,
          saved: 1,
          savedUser: 1,
          'user.userName': 1,
          'user.profileImg': 1,
          'likes': 1
        }
      }
      ]).sort({ createdAt: -1 }).skip(skip).limit(limit).exec()
      console.log("repo", Response);

      return Response
    } catch (error) {
      console.error("error in fetching posts", error);
      throw error


    }

  }

  async getPostDetails(postId: string): Promise<IPost[]> {
    try {
      const objectId = new mongoose.Types.ObjectId(postId)
      const postDetails = await PostModel.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: 'users',
            localField: 'creator_id',
            foreignField: '_id',
            as: 'details'
          }
        },
        {
          $unwind: '$details' // Unwind to convert details array into a single object
        },
        {
          $project: {
            _id: 1,
            creator_id: 1,
            caption: 1,
            place: 1,
            images: 1,
            createdAt: 1,
            updatedAt: 1,
            'details.userName': 1,
            'details.profileImg': 1,
            'details.name':1,
            'details.bio':1,
            likes: 1
          }
        }
      ]).sort({ createdAt: -1 })
      return postDetails

    } catch (error) {
      throw error
    }
  }
  async postCaption(postId: string, caption: string): Promise<IPost> {
    try {
      const saved = await PostModel.findByIdAndUpdate(postId, { caption })
      return saved as IPost
    } catch (error) {
      throw error
    }
  }

  async postDelete(postId: string): Promise<IPost | null> {
    try {
      const deletePost = await PostModel.findByIdAndDelete(postId)
      if (deletePost) {
        await reportModel.deleteMany({ postId: postId });
      }
      return deletePost as IPost | null
    } catch (error) {
      throw error
    }
  }

  async Post(postId: string, userId: string): Promise<IPost> {
    try {
      const Post: IPost | null = await PostModel.findById(postId)
      return Post as IPost
    } catch (error) {
      throw error
    }
  }
  async likePost(postId: string, user_id: string): Promise<IPost | null> {
    try {

      const postDoc = await PostModel.findById(postId).exec();

      if (postDoc) {

        postDoc.liked.push(user_id);
        postDoc.likes = (postDoc.likes || 0) + 1;

        await postDoc.save();

        return postDoc as IPost
      } else {
        return null
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error // Indicate failure
    }
  }
  async unlikePost(postId: string, user_id: string): Promise<IPost | null> {
    try {
      const postDoc = await PostModel.findById(postId).exec();

      if (postDoc) {

        postDoc.liked = postDoc.liked.filter(id => id !== user_id);

        if (postDoc.likes > 0) {
          postDoc.likes -= 1;
        }

        await postDoc.save();

        return postDoc as IPost
      } else {
        return null // Post not found
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error; // Indicate failure
    }
  }

  async getLikedPosts(userId: string): Promise<IPost[]> {
    try {
      const likedPosts = await PostModel.find({ liked: userId }).exec()
      return likedPosts

    } catch (error) {
      throw error
    }
  }


  async savePost(postId: string, user_id: string): Promise<IUser | null> {
    try {
      console.log("heyyy");

      const userDoc = await UserModel.findById(user_id).exec();
      const postDoc = await PostModel.findById(postId).exec()

      if (userDoc && postDoc) {

        userDoc.saved.push(postId)
        console.log("postsss", postDoc);

        console.log("array checking", typeof (user_id));

        postDoc.savedUser.push(user_id)

        await userDoc.save();
        await postDoc.save()

        return userDoc as any
      } else {
        return null
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error // Indicate failure
    }
  }
  async unSavePost(postId: string, user_id: string): Promise<IUser | null> {
    try {

      const userDoc = await UserModel.findById(user_id).exec();
      const postDoc = await PostModel.findById(postId).exec()

      if (userDoc && postDoc) {

        userDoc.saved = userDoc.saved.filter(id => id !== postId);
        postDoc.savedUser = postDoc.savedUser.filter(id => id !== user_id)

        await userDoc.save();
        await postDoc.save()

        return userDoc as any
      } else {
        return null // Post not found
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error; // Indicate failure
    }

  }

  async savedPosts(user_id: string): Promise<IPost[]> {
    try {

      const user = await UserModel.findById(user_id).exec()
      const savedPostIds = user?.saved?.map(id => new mongoose.Types.ObjectId(id));
      console.log("what happening", savedPostIds);

      const posts = await PostModel.find({
        _id: { $in: savedPostIds },
        blocked: false  
      }).exec();
      

      return posts as IPost[]
    } catch (error) {
      throw error
    }
  }
  async createReport(postId: string, reporterId: string, description: string,category:string): Promise<IReport> {
    console.log("postid in repository", postId);
    console.log("category in repo",category);
    

    try {
      const newReport = new reportModel({
        postId,
        reporterId,
        description,
        category
      });

      await newReport.save();
      return newReport.toObject();
    } catch (error) {
      throw error
    }
  }
  async existingReport(postId: string, reporterId: string): Promise<boolean> {
    try {
      const objectPostId = new mongoose.Types.ObjectId(postId);
      const objectReporterId = new mongoose.Types.ObjectId(reporterId);
      const reportExists = await reportModel.findOne({
        postId: objectPostId,
        reporterId: objectReporterId
      }).exec();
      return reportExists !== null;
    } catch (error) {
      console.error('Error checking existing report:', error);
      throw error;
    }
  }

}