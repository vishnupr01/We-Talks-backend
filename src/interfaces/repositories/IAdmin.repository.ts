import { IAdmin } from "../../entities/admin.entity";
import IAuth from "../../entities/auth.entity";
import IPost from "../../entities/post.entity";
import { IReport } from "../../entities/report.entity";
export default interface IAdminRepository {
  getUsers(page: number): Promise<any>
  blockUser(email: string): Promise<boolean>
  unblockUser(email: string): Promise<boolean>
  detailsDay(): Promise<{ users: number[], posts: number[] }>
  detailsMonth(): Promise<{ users: number[], posts: number[] }>
  detailsYear(): Promise<{ users: number[], posts: number[] }>
  totalDetails(): Promise<{ users: number, posts: number }>
  getAllReports(): Promise<IReport[]>
  getSingleReportDetails(reportId: string): Promise<any>
  getAllBlockedPosts(page: number, limit: number): Promise<{ posts: IPost[], totalBlockedPosts: number }>
  unblockPost(postId: string): Promise<boolean>
  blockPost(postId: string): Promise<boolean>


}