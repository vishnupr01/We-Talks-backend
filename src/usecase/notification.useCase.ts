import { IFriendRequest } from "../entities/friendRequest.entity";
import INotification from "../entities/notification.entity";
import FriendRequest from "../frameworks/models/friendRequest.model";
import INotificationRepository from "../interfaces/repositories/INotification.repository";
import INotificationUseCase from "../interfaces/usecase/INotification.useCase";

export class NotificationUseCase implements INotificationUseCase {
  private notificationRepository
  constructor(notificationRepository: INotificationRepository) {
    this.notificationRepository = notificationRepository
  }

  async getAllnotification(userId: string): Promise<INotification[]> {
    try {
      if (!userId) {
        throw new Error("credentials are missing")
      }
      const notifications = await this.notificationRepository.getAllNotification(userId)
      return notifications
    } catch (error) {
      throw error
    }
  }

  async getNotificationCount(userId: string): Promise<number> {
    try {
      if (!userId) {
        throw new Error("credentials are missing")
      }
      const count = await this.notificationRepository.notificationCount(userId)
      return count

    } catch (error) {
      throw error
    }
  }

  async newFriendRequest(senderId: string, receiverId: string): Promise<IFriendRequest | string> {
    try {
      if (!senderId || !receiverId) {
        throw new Error("credential server error");
      }

      const isExist = await this.notificationRepository.existFriendRequest(senderId, receiverId);
      if (isExist) {
        return "Friend request already exists";
      }

      const friendRequest = await this.notificationRepository.createFriendRequest(senderId, receiverId);
      return friendRequest;

    } catch (error) {
      throw error;
    }
  }
  async getAllFriendRequest(userId: string): Promise<any> {
    try {
      if (!userId) {
        throw new Error("credential server error")
      }
      const response = await this.notificationRepository.allFriendRequests(userId)
      return response

    } catch (error) {
      throw error
    }
  }
  async acceptRequest(senderId: string,receiverId:string,updaterId:string): Promise<IFriendRequest|null> {
    try {
      if (!senderId||!receiverId||!updaterId ) {
        throw new Error("credential server error")
      }
      const response = await this.notificationRepository.confirmRequest(senderId,receiverId,updaterId)
      return response
    } catch (error) {
      throw error
    }
  }

}