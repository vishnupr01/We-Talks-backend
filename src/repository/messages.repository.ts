import mongoose, { ObjectId } from "mongoose";
import IConversation from "../entities/conversation.entity";
import Conversation from "../frameworks/models/conversation.model";
import IMessageRepository from "../interfaces/repositories/IMessages.repository";
import Message from "../frameworks/models/message.model";
import IMessage from "../entities/message.entity";
import IUser from "../entities/user.entity";

export class MessageRepository implements IMessageRepository {
  async createConverSation(senderId: string, receiverId: string): Promise<Boolean> {
    try {
      const sender = new mongoose.Types.ObjectId(senderId)
      const receiver = new mongoose.Types.ObjectId(receiverId)
      const conversation = await Conversation.create({
        participants: [sender, receiver]
      })

      return true

    } catch (error) {
      throw error
    }

  }

  async findConversation(senderId: string, receiverId: string): Promise<IConversation> {
    try {
      console.log("findconverSation", senderId);
      console.log("findconverSation", receiverId);


      const receiver = new mongoose.Types.ObjectId(receiverId)
      console.log("after conversion", receiver);
      const sender = new mongoose.Types.ObjectId(senderId)
      console.log("after conversion", sender);



      const conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] }
      })
      console.log("conversation success", conversation);

      return conversation as IConversation

    } catch (error) {
      throw error
    }
  }
  async createMessage(senderId: string, receiverId: string, message: string): Promise<IMessage> {
    try {

      const sender = new mongoose.Types.ObjectId(senderId)
      const receiver = new mongoose.Types.ObjectId(receiverId)
      console.log("senderId", sender);
      console.log("receiver", receiver);
      console.log(message);

      const newMessage = new Message({
        senderId: sender,
        receiverId: receiver,
        message: message
      })
      await newMessage.save()
      const conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] }
      })
      if (conversation) {
        conversation.messages.push(newMessage._id);
        await conversation.save(); // Save the updated conversation to the database
      }

      return newMessage

    } catch (error) {
      throw error
    }
  }
  async getAllMessages(senderId: string, receiverId: string): Promise<IMessage[]> {
    try {
      const sender = new mongoose.Types.ObjectId(senderId);
      const receiver = new mongoose.Types.ObjectId(receiverId);

      const existConversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] }
      });

      // If the conversation does not exist, create it without creating a dummy message
      if (existConversation===null) {
        const newConversation = new Conversation({
          participants: [sender, receiver],
          messages: []
        });
        await newConversation.save();

      }
      const conversation = await Conversation.findOne({
        participants: { $all: [sender, receiver] }
      }).populate<{ messages: IMessage[] }>("messages");
      if (!conversation) {
        throw new Error("error in message repo")
      }
      console.log("hey john",conversation);   
      
      return conversation.messages;
    } catch (error) {
      console.error("Error getting messages:", error);
      throw error;
    }
  }

  async userConversations(senderId: string): Promise<any> {
    try {
      const sender = new mongoose.Types.ObjectId(senderId);
      const conversations = await Conversation.find({
        participants: sender
      }).populate<{ participants: IUser[] }>('participants')
        .populate<{ messages: IMessage[] }>('messages');


      const result = await Promise.all(conversations.map(async (conversation) => {
        const receiver = conversation.participants.find(participant => {
          return (participant._id as mongoose.Types.ObjectId).toString() !== senderId;
        });

        console.log("Here is your receiver", receiver);

        if (!receiver) {
          throw new Error("Receiver not found");
        }

        const lastMessage = conversation.messages[conversation.messages.length - 1];
        return {
          conversationId: conversation._id,
          receiverName: receiver.name,
          receiverId:receiver._id,
          receiverProfile:receiver.profileImg,
          lastMessage: lastMessage ? lastMessage.message : null,
          updatedAt: conversation.updatedAt,
         
        };
      }));

      return result;
    } catch (error) {
      throw error;
    }



  }
}