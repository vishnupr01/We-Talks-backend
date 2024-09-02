import { Server } from "socket.io";
import {Server as HttpServer } from 'http' 
import setupSocketHandlers from "./socketioHandlers";

export default function initializeSocketIO(server:HttpServer){
  const io=new Server(server,{
    cors:{
      origin:[
        "https://we-talks-frontend.vercel.app"
      ],
      methods:["GET","POST"],
      credentials:true  
    }
  })
  setupSocketHandlers(io)
return io
}