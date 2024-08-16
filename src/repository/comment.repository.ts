import mongoose from "mongoose";
import IComment, { IReply } from "../entities/comment.entity";
import Comment from "../frameworks/models/comment.model";
import { ICommentRepository } from "../interfaces/repositories/IComment.repository";

export class CommentRepository implements ICommentRepository {
  async commentCreate(postId: string, authId: string, text: string,): Promise<IComment | null> {
    try {
      const postObjectId = new mongoose.Types.ObjectId(postId);
      const authorObjectId = new mongoose.Types.ObjectId(authId);
      const comment = new Comment({
        post_id: postObjectId,
        author_id: authorObjectId,
        comment: text
      })

      const savedComment = await comment.save()

      const commentData: IComment = {
        _id: savedComment._id.toString(),
        postId: savedComment.post_id.toString(),
        author_id: savedComment.author_id.toString(),
        comment: savedComment.comment
      }
      return commentData
    } catch (error) {
      throw error
    }

  }

  async getAllComments(postId: string, skip: number, limit: number): Promise<IComment[] | null> {
    try {
      const postObjectId = new mongoose.Types.ObjectId(postId)
      console.log("skip", skip);
      console.log("limit", limit);

      const response = await Comment.aggregate([
        {
          $match: { post_id: postObjectId }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'author_id',
            foreignField: '_id',
            as: 'authorDetails'
          },
        },
        {
          $unwind: '$authorDetails'
        },
        {
          $project: {
            _id: 1,
            comment: 1,
            post_id: 1,
            author_id: 1,
            createdAt: 1,
            updatedAt: 1,
            replies: 1,
            liked:1,
            likes:1,
            'authorDetails.userName': 1,
            'authorDetails.profileImg': 1
          }
        }
      ]).sort({ createdAt: -1 }).skip(skip).limit(limit)
      console.log("repocomme", response);

      return response as IComment[] | null
    } catch (error) {
      throw error
    }
  }
  async replyComment(commentId: string, userId: string, replyText: string): Promise<IComment | null> {
    try {
      const commentObjectId = new mongoose.Types.ObjectId(commentId)
      const userObjectId = new mongoose.Types.ObjectId(userId)
      await Comment.updateOne({ _id: commentObjectId },
        {
          $push: {
            replies: {
              user_id: userObjectId,
              comment: replyText
            }
          }
        }
      )
      const updatedComment = await Comment.findById(commentObjectId).exec()
      return updatedComment as IComment | null
    } catch (error) {
      throw error

    }

  }


  async getReplies(commentId: string): Promise<IReply[] | undefined> {
    try {
      const commentObjectId = new mongoose.Types.ObjectId(commentId);
      const repliesWithUserDetails = await Comment.aggregate([
        { $match: { _id: commentObjectId } },
        { $unwind: '$replies' }, // Deconstruct the replies array
        {
          $lookup: {
            from: 'users',
            localField: 'replies.user_id',
            foreignField: '_id',
            as: 'replyUserDetails'
          }
        },
        { $unwind: '$replyUserDetails' }, // Deconstruct the user details array
        {
          $project: {
            _id: 0, // Exclude the comment ID
            'replies.user_id': 1,
            'replies.comment': 1,
            'replies.createdAt': 1, // Include createdAt field
            'replyUserDetails.userName': 1,
            'replyUserDetails.profileImg': 1
          }
        },
        {
          $sort: {
            'replies.createdAt': -1 // Sort by createdAt in descending order
          }
        },
        {
          $group: {
            _id: '$_id',
            replies: {
              $push: {
                user_id: '$replies.user_id',
                comment: '$replies.comment',
                createdAt: '$replies.createdAt', // Include createdAt field in the push
                userName: '$replyUserDetails.userName',
                profileImg: '$replyUserDetails.profileImg'
              }
            }
          }
        }
      ]);

      return repliesWithUserDetails[0]?.replies || []; // Return empty array if no replies found
    } catch (error) {
      throw error;
    }
  }


  async commentLike(commentId: string, userId: string): Promise<IComment | null> {
    try {
      const commentDoc = await Comment.findById(commentId).exec()
      if (commentDoc) {

        commentDoc.liked.push(userId);
        commentDoc.likes = (commentDoc.likes || 0) + 1;

        await commentDoc.save();
        const commentData: IComment = {
          _id: commentDoc._id.toString(),
          postId: commentDoc.post_id.toString(),
          author_id: commentDoc.author_id.toString(),
          comment: commentDoc.comment,
          liked: commentDoc.liked,
          likes: commentDoc.likes
        }

        return commentData as IComment | null
      } else {
        return null
      }

    } catch (error) {
      throw error
    }
  }
  async unlikeComment(commentId: string, userId: string): Promise<IComment | null> {
    try {
      const commentDoc = await Comment.findById(commentId).exec()
      if (commentDoc) {

        commentDoc.liked = commentDoc.liked.filter(id => id !== userId);
        if (commentDoc.likes > 0) {
          commentDoc.likes -= 1;
        }

        await commentDoc.save();
        const commentData: IComment = {
          _id: commentDoc._id.toString(),
          postId: commentDoc.post_id.toString(),
          author_id: commentDoc.author_id.toString(),
          comment: commentDoc.comment,
          liked: commentDoc.liked,
          likes: commentDoc.likes
        }

        return commentData as IComment
      } else {
        return null // Post not found
      }

    } catch (error) {
      throw error
    }
  }
  // async Post(postId: string, userId: string): Promise<IPost> {
  //   try {
  //     const Post: IPost | null = await PostModel.findById(postId)
  //     return Post as IPost
  //   } catch (error) {
  //     throw error
  //   }
  // }
  async comment(commentId: string, userId: string): Promise<IComment> {
    try {
      const comment: IComment | null = await Comment.findById(commentId)
      return comment as IComment

    } catch (error) {
      throw error
    }
  }




}