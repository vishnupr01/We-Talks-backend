import IComment, { IReply } from "../../entities/comment.entity";

export interface ICommentUseCase{
  newComment(postId: string, authorId: string, text: string): Promise<IComment>
  allComments(postId: string,skip:number,limit:number): Promise<IComment[] | null> 
  commentReply(commentId: string, userId: string, replyText: string): Promise<IComment | null>
  getAllReplies(commentId: string): Promise<IReply[] | undefined> 
  islikedComment(commentId: string, userId: string): Promise<IComment | null> 
} 