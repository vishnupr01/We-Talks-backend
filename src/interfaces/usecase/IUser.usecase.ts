import IPost from "../../entities/post.entity";
import IUser from "../../entities/user.entity";
export interface JwtPayload{
  id:string,
  user_id:string
}
export interface IUserUseCase{
  getUserProfile(_id:string):Promise<any>
  updateProfile(_id:string,data:IUser):Promise<{updatedProfile:IUser,token:string}>
  profileImg(_id:string,image:string):Promise<{userProfile:IUser,token:string}>
  getSearchUsers(query:string):Promise<IUser[]>
  userFriends(userId: string): Promise<IUser[]>
  removeFriend(userId: string, friendId: string): Promise<IUser | null>
  searchAFriend(userId:string,query:string):Promise<IUser[]>
  blockUser(userId: string, blockId: string): Promise<Partial<IUser> | null>
  unBlockFriend(user_id: string, blockId: string): Promise<Partial<IUser> | null>
  getMutualFriends(userId: string): Promise<any[]>
  deleteFriendRequestById(requestId: string): Promise<boolean>
  
  


}