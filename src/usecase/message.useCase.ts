import IMessage from "../entities/message.entity";
import { getRecieverId } from "../frameworks/configs/socketioHandlers";
import IMessageRepository from "../interfaces/repositories/IMessages.repository";
import IMessageUseCase from "../interfaces/usecase/IMessage.usecase";
import { io } from "../server";

export class MessageUseCase implements IMessageUseCase {
  private messageRepository: IMessageRepository
  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository
  }
  async sendMessage(senderId: string, receiverId: string, message: string): Promise<IMessage> {
    try {
      console.log("check message error",senderId);
      console.log(receiverId);
      console.log(message);
      
      if (!senderId || !receiverId || !message) {
        throw new Error("credentials are missing")
      }
      console.log("this is the ", message);
      console.log("error in sender", senderId);
      console.log("error in receiver", receiverId);
      const conversation = await this.messageRepository.findConversation(senderId, receiverId)
      if (conversation === null) {
        const newConversation = await this.messageRepository.createConverSation(senderId, receiverId)
      }
      const createdMessage = await this.messageRepository.createMessage(senderId, receiverId, message)
      const checkId=getRecieverId(receiverId) 
      if(checkId){ 
        console.log("entering on socket");
          
      io.to(receiverId).emit("newMessage",createdMessage)
      }
      if (!createdMessage) {
        throw new Error("server error on useCase")  
      }
      return createdMessage 


    } catch (error) {
      console.log("error in message UseCase sendMessage", error);

      throw error
    }

  }

  async allMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
    try {
      if (!senderId || !receiverId) {
        throw new Error("credential error in useCase")
      }
      const messages = await this.messageRepository.getAllMessages(senderId, receiverId)
      if (!messages) {
        throw new Error("server down")
      }
      return messages

    } catch (error) {
      throw error
    }
  }

  async getUserConversations(senderId:string):Promise<any>{
    try {
      if(!senderId){
        throw new Error("credential error in usecase")
      }
      const conversations=await this.messageRepository.userConversations(senderId)
      if(!conversations){
        throw new Error("server error")
      }
      return  conversations
      
    } catch (error) {
      throw error
    }
  }


}