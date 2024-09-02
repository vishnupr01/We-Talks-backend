import IPost from "../../entities/post.entity"
import { IReport } from "../../entities/report.entity"
import IUser from "../../entities/user.entity"

export interface IPostUseCase{
  createPost(data:IPost):Promise<IPost>
  getPosts(skip:any,limit:any):Promise<IPost[]>
  getSinglePostDetail(postId:string,_id:string):Promise<IPost[]>
  editCaption(postId:string,caption:string):Promise<IPost>
  deletePost(postId: string): Promise<IPost | null>
  isLiked(postId:string,userId:string):Promise<IPost|null>
  getLiked(userId: string): Promise<IPost[]>
  isSaved(postId:string,userId:string):Promise<IUser|null>
  getAllSavedPosts(user_id:string):Promise<IPost[]>
  createReport(post_id: string, reporter_id: string, description: string,category:string): Promise<IReport|string>
}