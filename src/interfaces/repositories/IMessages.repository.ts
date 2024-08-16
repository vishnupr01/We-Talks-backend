import IConversation from "../../entities/conversation.entity"
import IMessage from "../../entities/message.entity"

export default interface IMessageRepository{
  createConverSation(senderId:string,receiverId:string): Promise<Boolean>
  findConversation(senderId: string, receiverId: string): Promise<IConversation>
  createMessage(senderId: string, receiverId: string, message: string): Promise<IMessage>
  getAllMessages(senderId: string, receiverId: string): Promise<IMessage[]>
  userConversations(senderId:string):Promise<any>
}