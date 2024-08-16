import { Server, Socket } from "socket.io";
import dotenv from 'dotenv';
import { verifyJWT } from "../utils/jwt.token";
import { JwtPayload } from "../../interfaces/usecase/IUser.usecase";

dotenv.config();
export const getRecieverId=(receiverId:string)=>{
  return userSocketMap[receiverId]
}
const userSocketMap: { [key: string]: string } = {};  

export default function setupSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log("A user is connected");
 
    const token = socket.handshake.auth.token;

    try {
      const decoded = verifyJWT(token);

      if (decoded) {
        socket.data.user = decoded as JwtPayload;

        const user = socket.data.user;

        userSocketMap[user.id] = socket.id;

        const onlineUsers = Object.keys(userSocketMap);
        

        // Emit the list of online users
        io.emit("getOnlineUsers", onlineUsers);

        socket.join(user.id);

        // Handle disconnection
        socket.on("disconnect", () => {
          console.log("user disconnected");
          delete userSocketMap[user.id];
          const updatedOnlineUsers = Object.keys(userSocketMap);
          io.emit("getOnlineUsers", updatedOnlineUsers);
        });
      } else {
        console.error("Invalid token");
        socket.disconnect();
      }
    } catch (error) {
      console.error("Token verification error:", error);
      socket.disconnect();
    }
  });

  return io;
}
