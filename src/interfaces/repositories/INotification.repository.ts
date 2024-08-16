import { IFriendRequest } from "../../entities/friendRequest.entity";
import INotification from "../../entities/notification.entity";

export default interface INotificationRepository{
  createNotification(data: INotification): Promise<INotification>
  getAllNotification(user_id: string): Promise<INotification[]>
  notificationCount(user_id: string): Promise<number>
  createFriendRequest(senderId: string, receiverId: string): Promise<IFriendRequest> 
 existFriendRequest(senderId: string, receiverId: string): Promise<Boolean>
 allFriendRequests(userId: string): Promise<any[]>
 confirmRequest(senderId: string,receiverId:string,updaterId:string): Promise<IFriendRequest|null> 

  
}