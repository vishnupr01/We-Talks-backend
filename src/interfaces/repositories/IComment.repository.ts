import IComment, { IReply } from "../../entities/comment.entity";

export interface ICommentRepository{
  commentCreate(postId: string, text: string, authId: string): Promise<IComment| null> 
  getAllComments(postId: string,skip:number,limit:number): Promise<IComment[] | null>
  replyComment(commentId: string, userId: string, replyText: string): Promise<IComment | null> 
  getReplies(commentId: string): Promise<IReply[] | undefined> 
  comment(commentId: string, userId: string): Promise<IComment>
  commentLike(commentId: string, userId: string): Promise<IComment | null>
  unlikeComment(commentId: string, userId: string): Promise<IComment | null>
  
}      