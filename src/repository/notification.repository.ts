import mongoose from "mongoose";
import INotification from "../entities/notification.entity";
import { NotificationModel } from "../frameworks/models/notification.Model";
import INotificationRepository from "../interfaces/repositories/INotification.repository";
import FriendRequest from "../frameworks/models/friendRequest.model";
import { IFriendRequest } from "../entities/friendRequest.entity";
import { UserModel } from "../frameworks/models/user.Model";

export class NotificationRepository implements INotificationRepository {

  async createNotification(data: INotification): Promise<INotification> {
    try {
      const newNotification = new NotificationModel({
        sender: data.sender,
        type: data.type,
        receiver: data.receiver,
        message: data.message,
        postId: data.postId
      })
      const saveNotification = await newNotification.save()
      return saveNotification
    } catch (error) {
      throw error
    }
  }
  async getAllNotification(user_id: string): Promise<INotification[]> {
    try {
      const userId = new mongoose.Types.ObjectId(user_id)
      await NotificationModel.updateMany(
        { receiver: userId, read: false },
        { $set: { read: true } }
      );
      const response = await NotificationModel.find({ receiver: userId })
        .sort({ createdAt: -1 })  // Corrected sorting method
        .populate({
          path: 'sender',
          select: 'profileImg',
        })
        .populate({
          path: 'postId',
          select: 'images',
        });


      return response;
    } catch (error) {
      throw error;
    }
  }


  async notificationCount(user_id: string): Promise<number> {
    try {
      const userId = new mongoose.Types.ObjectId(user_id)
      const count = await NotificationModel.countDocuments({
        receiver: userId,
        read: false
      });
      return count
    } catch (error) {
      throw error
    }
  }

  async createFriendRequest(senderId: string, receiverId: string): Promise<IFriendRequest> {
    const sender = new mongoose.Types.ObjectId(senderId);
    const receiver = new mongoose.Types.ObjectId(receiverId);
    try {
      const friendRequest = new FriendRequest({
        sender: sender,
        receiver: receiver
      })
      await friendRequest.save()
      return friendRequest
    } catch (error) {
      throw error
    }

  }
  async existFriendRequest(senderId: string, receiverId: string): Promise<Boolean> {
    const sender = new mongoose.Types.ObjectId(senderId);
    const receiver = new mongoose.Types.ObjectId(receiverId);

    try {
      const friendRequest = await FriendRequest.findOne({
        sender: sender,
        receiver: receiver
      });

      return !!friendRequest;
    } catch (error) {
      throw error;
    }
  }

  async allFriendRequests(userId: string): Promise<any[]> { // Return type can be adjusted as needed
    const user = new mongoose.Types.ObjectId(userId);
    try {
      const friendRequests = await FriendRequest.aggregate([
        {
          $match: { receiver: user }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'sender',
            foreignField: '_id',
            as: 'senderDetails'
          }
        },
        {
          $unwind: '$senderDetails'
        },
        {
          $sort: { createdAt: -1 }
        },
        {
          $project: {
            sender: 1,
            receiver: 1,
            status: 1,
            createdAt: 1,
            'senderDetails.profileImg': 1,
            'senderDetails.name': 1
          }
        }
      ])

      return friendRequests;
    } catch (error) {
      throw error;
    }
  }

  async confirmRequest(senderId: string, receiverId: string,updaterId:string): Promise<IFriendRequest | null> {
    try {
      const sender = new mongoose.Types.ObjectId(senderId)
      const receiver = new mongoose.Types.ObjectId(receiverId);
      const updater=new mongoose.Types.ObjectId(updaterId);
      await UserModel.findByIdAndUpdate(
        updater,
        { $push: { friends: receiver } }
      );

      await UserModel.findByIdAndUpdate(
        receiver,
        { $push: { friends: updater} }
      );
      const response = await FriendRequest.findByIdAndUpdate(
        { _id: sender },
        { status: 'accepted' },
        { new: true }
      );
      if (!response) {
        return null
      }
      return response

    } catch (error) {
      console.error('Error confirming friend request:', error);
      throw error // Return false in case of any error
    }
  }

}

