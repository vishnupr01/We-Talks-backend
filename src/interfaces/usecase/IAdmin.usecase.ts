import { IAdmin, IAdminLogin } from "../../entities/admin.entity";
import { Request } from "express";
import { IReport } from "../../entities/report.entity";
import IPost from "../../entities/post.entity";
export default interface IAdminUseCase {
  adminLogin(email: string, password: string): Promise<boolean>
  getAllUsers(page: number): Promise<any>
  blockingUser(email: string): Promise<boolean>
  unBlockingUser(email: string): Promise<boolean>
  yearDetails(): Promise<{ users: number[], posts: number[] }>
  monthDetails(): Promise<{ users: number[], posts: number[] }>
  dayDetails(): Promise<{ users: number[], posts: number[] }>
  detailsTotal(): Promise<{ users: number, posts: number }>
  allReports(): Promise<IReport[]>
  getSinglePost(postId: string, reportId: string): Promise<IPost[]>
  blockPost(postId: string): Promise<boolean>
  unblockPost(postId: string): Promise<boolean>
  getAllBlockedPosts(page: number, limit: number): Promise<{ posts: IPost[], totalBlockedPosts: number }>


}
export interface BlockRequest extends Request {

}