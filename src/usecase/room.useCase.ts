import { getRecieverId } from "../frameworks/configs/socketioHandlers";
import { IRoomUseCase } from "../interfaces/usecase/IRoom.usecase";
import { io } from "../server";


export class RoomUseCase implements IRoomUseCase {
  constructor() {

  }
  async spaceInvitaion(roomId: string, userId: string, token: string,userName:string,image:string,currentUserId:string): Promise<any> {
    try {
      if (!roomId || !userId) {
        throw new Error("credential server error")
      }
      const checkId = getRecieverId(userId)
      if (checkId) {
        console.log("user in space");
        io.to(userId).emit("invitation", { roomId, userId, token,userName,image,currentUserId });
      } 
        
    } catch (error) {
      throw error
      console.log(error);

    }
  }
  async declineInvitation(userId:string,userName:string):Promise<void>{
    try {
      if(!userId||!userName){
        throw new Error("credential server error")
      }
      const checkId = getRecieverId(userId)
      if (checkId) {
        console.log("user in spacerequest");
        const message=`${userName} declined your join request`
        io.to(userId).emit("declined",message);
      } 
      
      
    } catch (error) {
      throw error
    }

  }
}