import IUser from "../entities/user.entity";
import { CloudinaryService } from "../frameworks/utils/cloudinary";
import { createJWT } from "../frameworks/utils/jwt.token";
import { IAuthRepository } from "../interfaces/repositories/IAuth.repository";
import { IUserRepository } from "../interfaces/repositories/IUser.repository";
import { IUserUseCase } from "../interfaces/usecase/IUser.usecase";

export class UserUseCase implements IUserUseCase {
  private userRepository: IUserRepository
  private authRepository: IAuthRepository
  private cloudinaryService: CloudinaryService
  constructor(userRepository: IUserRepository, authRepository: IAuthRepository, cloudinaryService: CloudinaryService) {
    this.userRepository = userRepository
    this.authRepository = authRepository
    this.cloudinaryService = cloudinaryService
  }
  async getUserProfile(_id: string): Promise<any> {
    try {
      console.log("dfdjs", _id);

      const userProfile = await this.userRepository.UserProfile(_id)
      if (!userProfile) {
        throw new Error("User profile not found")
      }
      return userProfile
    } catch (error) {
      console.log("error in useCase", error);

      throw error
    }
  }
  async updateProfile(_id: string, data: IUser): Promise<{ updatedProfile: IUser, token: string }> {
    try {
      const { userName, name, dob, bio } = data
      if (!userName && !name && !dob && !bio) {
        throw new Error("credential are required")
      }
      const userExists = await this.authRepository.checkUsernameExists(data.userName)
      const currentUserName = await this.userRepository.currentUser(_id)
      if (userExists && currentUserName?.userName !== userName) {
        console.log("username error");
        throw new Error("userName already exists")
      }
      const BirthDate = new Date()
      BirthDate.setFullYear(BirthDate.getFullYear() - 16)
      console.log(BirthDate);
      const currenDate = new Date(dob.toString())
      if (currenDate >= BirthDate) {
        throw new Error("enter the correct date")
      }

      const updatedProfile = await this.userRepository.updateProfile(_id, data)
      console.log("here is ur", updatedProfile);
      if (!updatedProfile) {
        throw new Error("Failed to update profile.");
      }
      const payload = { id: updatedProfile._id, name: updatedProfile.name, email: updatedProfile.email, image_url: updatedProfile.profileImg, isBlocked: updatedProfile.isBlocked }
      const token = createJWT(payload, 5)
      return { updatedProfile, token }

    } catch (error: any) {
      console.log("error in useCase", error)
      throw error

    }
  }

  async profileImg(_id: string, image: string): Promise<{ userProfile: IUser, token: string }> {
    try {
      if (!_id || !image) {
        throw new Error("credential are missing")
      }

      const imageUrl = await this.cloudinaryService.uploadImage(image)
      const userProfile = await this.userRepository.updateProfileImg(_id, imageUrl)

      if (!userProfile) {
        throw new Error("Failed to update profile image");
      }
      const payload = { id: userProfile._id, name: userProfile.name, email: userProfile.email, image_url: userProfile.profileImg, isBlocked: userProfile.isBlocked }
      const token = createJWT(payload, 5)
      console.log("hey userrr", userProfile);

      return { userProfile, token }
    } catch (error) {
      throw error
    }
  }

  async getSearchUsers(query: string): Promise<IUser[]> {
    try {
      console.log("useCase", query);

      if (!query) {
        throw new Error("credential error")
      }
      const users = await this.userRepository.searchUsers(query)
      return users as IUser[]

    } catch (error) {
      throw error
    }
  }
  async userFriends(userId: string): Promise<IUser[]> {
    try {
      if (!userId) {
        throw new Error("credential server error")
      }
      const response = await this.userRepository.fetchFriends(userId)
      return response as IUser[]

    } catch (error) {
      throw error
    }
  }
  async removeFriend(userId: string, friendId: string): Promise<IUser | null> {
    try {
      if (!userId || !friendId) {
        throw new Error("credential server error")
      }
      const response = await this.userRepository.unfriend(userId, friendId)
      return response

    } catch (error) {
      throw error

    }
  }
  async searchAFriend(userId: string, query: string): Promise<IUser[]> {
    try {
      if (!userId || !query) {
        throw new Error("credential server error")
      }
      const response = await this.userRepository.searchFriends(userId, query)
      return response

    } catch (error) {
      throw error
    }
  }
  async blockUser(userId: string, blockId: string): Promise<Partial<IUser> | null> {
    try {
      if (!userId || !blockId) {
        throw new Error("credential server error")
      }
      const response = await this.userRepository.blockUser(userId, blockId)
      return response
    } catch (error) {
      throw error
    }
  }


  async unBlockFriend(user_id: string, blockId: string): Promise<Partial<IUser> | null> {
    try {
      if (!user_id || !blockId) {
        throw new Error("credential server error")
      }
      const response = await this.userRepository.unblockUser(user_id, blockId)
      return response
    } catch (error) {
      throw error
    }
  }
  async getMutualFriends(userId: string): Promise<any[]> {
    try {
      console.log("Fetching mutual friends for user:", userId);
      const mutualFriends = await this.userRepository.findMutualFriends(userId);
      if (!mutualFriends) {
        throw new Error("No mutual friends found");
      }
      return mutualFriends;
    } catch (error) {
      console.error("Error in use case:", error);
      throw error;
    }
  }
  async deleteFriendRequestById(requestId: string): Promise<boolean> {
    try {
      console.log("Deleting friend request with ID:", requestId);
      const wasDeleted = await this.userRepository.deleteFriendRequestById(requestId);
      if (!wasDeleted) {
        throw new Error("Friend request not found or already deleted");
      }
      return wasDeleted;
    } catch (error) {
      console.log("Error in deleteFriendRequestById use case:", error);
      throw error;
    }
  }
}