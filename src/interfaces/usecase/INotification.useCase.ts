import { IFriendRequest } from "../../entities/friendRequest.entity";
import INotification from "../../entities/notification.entity";

export default interface INotificationUseCase{
  getAllnotification(userId: string): Promise<INotification[]>
  getNotificationCount(userId: string): Promise<number> 
  newFriendRequest(senderId: string, receiverId: string): Promise<IFriendRequest | string>
  getAllFriendRequest(userId: string): Promise<any>
  acceptRequest(senderId: string,receiverId:string,updaterId:string): Promise<IFriendRequest|null> 
  
  
}