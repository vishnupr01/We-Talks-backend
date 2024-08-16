import IMessage from "../../entities/message.entity";

export default interface IMessageUseCase{
  sendMessage(senderId: string, receiverId: string, message: string): Promise<IMessage>
  allMessages(senderId: string, receiverId: string): Promise<IMessage[]> 
  getUserConversations(senderId:string):Promise<any>

}