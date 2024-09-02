export interface IRoomUseCase {
  spaceInvitaion(roomId: string, userId: string, token: string,userName:string,image:string,currentUserId:string): Promise<any>
  declineInvitation(userId:string,userName:string):Promise<void>

}