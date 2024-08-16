import IPost from "../../entities/post.entity";
import IUser from "../../entities/user.entity";

export interface IPostRepository{
  postCreate(data: IPost): Promise<IPost>
  loadPosts(skip:any,limit:any):Promise<IPost[]>
  getPostDetails(postId:string):Promise<IPost[]>
  postCaption(postId: string,caption:string): Promise<IPost> 
  postDelete(postId: string): Promise<IPost | null>
  Post(postId:string,userId:string):Promise<IPost>
  unlikePost(postId: string, user_id: string): Promise<IPost | null> 
  likePost(postId: string, user_id: string): Promise<IPost|null>
  getLikedPosts(userId:string):Promise<IPost[]>
  unSavePost(postId: string, user_id: string): Promise<IUser| null>
  savePost(postId: string, user_id: string): Promise<IUser|null>
  savedPosts(user_id: string): Promise<IPost[]>

  
}