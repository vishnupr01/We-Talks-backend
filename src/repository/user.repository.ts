import IUser, { IBlockedUser } from "../entities/user.entity";
import mongoose, { ObjectId } from "mongoose";
import { UserModel } from "../frameworks/models/user.Model";
import { PostModel } from "../frameworks/models/post.model";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import IPost from "../entities/post.entity";
import FriendRequest from "../frameworks/models/friendRequest.model";

export class UserRepository implements IUserRepository {
  async UserProfile(_id: string): Promise<any> {
    try {
      const objectId = new mongoose.Types.ObjectId(_id);
      const response = await UserModel.aggregate([
        {
          $match: { _id: objectId }
        },
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'creator_id',
            as: 'posts',
            pipeline: [
              { $sort: { createdAt: -1 } }
            ]
          }
        },

        {
          $project: {
            _id: 1,
            userName: 1,
            profileImg: 1,
            friends: 1,
            dob: 1,
            blockedUsers: 1,
            name: 1,
            bio: 1,
            email: 1,
            isBlocked: 1,

            posts: {
              _id: 1,
              creator_id: 1,
              caption: 1,
              place: 1,
              images: 1,
              createdAt: 1,
              updatedAt: 1,
              likes: 1

            }
          }
        }
      ]);

      if (!response || response.length === 0) {
        throw new Error('User not found');
      }

      return response[0]; // Return the first (and likely only) document
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async updateProfile(_id: string, data: IUser): Promise<IUser | null> {
    try {
      const { userName, name, dob, bio } = data
      const currentUser = await UserModel.findById(_id).lean()
      if (!currentUser) {
        throw new Error("user not found")
      }
      const updateData: Partial<IUser> = {}
      if (userName && userName !== currentUser.userName) {
        updateData.userName = userName;
      }
      if (name && name.trim() !== '') {
        updateData.name = name.trim();
      }
      if (dob) {
        updateData.dob = dob;
      }
      if (bio && bio.trim() !== '') {
        updateData.bio = bio.trim();
      }
      const updateProfile = await UserModel.findByIdAndUpdate(
        _id,
        updateData,
        { new: true, runValidators: true })
      console.log("in repository", updateProfile);

      return updateProfile as IUser | null
    } catch (error) {
      console.log("error in mongodb", error);

      throw error
    }
  }
  async currentUser(_id: string): Promise<IUser | null> {
    try {
      const currentUser = await UserModel.findById(_id).lean()
      return currentUser as IUser | null
    } catch (error) {
      throw error
    }
  }
  async updateProfileImg(_id: string, image: string): Promise<IUser | null> {
    try {
      const profileImg = await UserModel.findByIdAndUpdate(
        _id,
        { $set: { profileImg: image } },
        { new: true }
      )
      const userProfile = await this.currentUser(_id)
      return userProfile as IUser | null
    } catch (error) {
      throw error
    }
  }

  async searchUsers(query: string): Promise<IUser[]> {
    try {
      const users = await UserModel.find({
        $or: [
          { userName: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ]
      }).limit(15).lean() as IUser[]
      return users
    } catch (error) {
      throw error
    }
  }
  async searchFriends(userId: string, query: string): Promise<IUser[]> {
    try {

      const user = await UserModel.findById(userId).lean();
      if (!user) {
        throw new Error("User not found or user has no friends");
      }

      const friends = await UserModel.find({
        _id: { $in: user.friends },
        $or: [
          { userName: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ]
      }).limit(15).lean() as IUser[];

      return friends;
    } catch (error) {
      console.error('Error searching friends:', error);
      throw error;
    }
  }




  async fetchFriends(userId: string): Promise<IUser[]> {
    try {
      const friends = await UserModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(userId) } },
        {
          $lookup: {
            from: 'users',
            localField: 'friends',
            foreignField: '_id',
            as: 'friendsDetails'
          }
        },
        { $unwind: '$friendsDetails' },
        {
          $replaceRoot: { newRoot: '$friendsDetails' }
        }
      ]).exec();

      return friends as IUser[];
    } catch (error) {
      throw error;
    }
  }
  async unfriend(userId: string, friendId: string): Promise<IUser | null> {
    try {
      const receiver = new mongoose.Types.ObjectId(userId);
      const sender = new mongoose.Types.ObjectId(friendId);

      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { $pull: { friends: friendId } },
        { new: true, runValidators: true }
      );
      const FiendUser = await UserModel.findByIdAndUpdate(
        friendId,
        { $pull: { friends: userId } },
        { new: true, runValidators: true }
      );
      await FriendRequest.findOneAndDelete({
        $or: [
          { sender: sender, receiver: receiver },
          { sender: receiver, receiver: sender }
        ]
      });
      return updatedUser as IUser | null;
    } catch (error) {
      console.error("Error unfriending user:", error);
      throw error;
    }
  }
  async blockUser(user_id: string, block_id: string): Promise<Partial<IUser> | null> {
    try {
      const userId = new mongoose.Types.ObjectId(user_id);
      const blockId = new mongoose.Types.ObjectId(block_id);

      const blockedUser = await UserModel.findById(blockId);
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new Error("User not found");
      }
      if (!blockedUser) {
        throw new Error("Blocked user not found");
      }

      // Ensure these values are correctly set
      console.log("userId:", userId);
      console.log("blockId:", blockId);

      blockedUser.blockedUsers.push({ blockedId: userId, status: "blocker" });
      user.blockedUsers.push({ blockedId: blockId, status: "target" });

      const updatedUser = await user.save();
      const saveBlockedUser = await blockedUser.save();

      return updatedUser.toObject() as Partial<IUser> | null;
    } catch (error) {
      console.error("Error blocking user:", error);
      throw error;
    }
  }
  async unblockUser(user_id: string, block_id: string): Promise<Partial<IUser> | null> {
    try {
      const userId = new mongoose.Types.ObjectId(user_id);
      const blockId = new mongoose.Types.ObjectId(block_id);

      // Find the users by their IDs
      const user: IUser | null = await UserModel.findById(userId);
      const blockedUser: IUser | null = await UserModel.findById(blockId);

      if (!user) {
        throw new Error("User not found");
      }
      if (!blockedUser) {
        throw new Error("Blocked user not found");
      }

      user.blockedUsers = user.blockedUsers?.filter((blocked: IBlockedUser) =>
        String(blocked.blockedId) === String(blockId) && blocked.status !== "target"
      );

      // Remove only the blocker entry from the blocked user's blockedUsers array
      blockedUser.blockedUsers = blockedUser.blockedUsers?.filter((blocked: IBlockedUser) =>
       String(blocked.blockedId)  === String(userId) && blocked.status !== "blocker"
      );
      console.log("user", user.blockedUsers);
      console.log("blockedUser", blockedUser.blockedUsers);

      // Save the updated user and blockedUser documents
      const updatedUser = await user.save();
      await blockedUser.save();

      return updatedUser.toObject() as Partial<IUser> | null;
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw error;
    }
  }

}

