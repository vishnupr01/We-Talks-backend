import IUser from "../../entities/user.entity";
export interface IUserRepository{
  UserProfile(_id: string): Promise<any>
  updateProfile(_id:string,data:IUser):Promise<IUser | null>
  currentUser(_id:string):Promise<IUser|null>
  updateProfileImg(_id:string,image:string):Promise<IUser|null>
  searchUsers(query:string):Promise<IUser[]>
  fetchFriends(userId: string): Promise<IUser[]>
  unfriend(userId: string, friendId: string): Promise<IUser | null>
  searchFriends(userId: string, query: string): Promise<IUser[]>
  blockUser(user_id: string, block_id: string): Promise<Partial<IUser> | null> 
  unblockUser(user_id: string, block_id: string): Promise<Partial<IUser> | null>
  
}