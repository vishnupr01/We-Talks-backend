import { NextFunction, Response, Request } from "express";
import { TokenService } from "../frameworks/utils/rtc";
import { RtcRole } from "agora-access-token";
import dotenv from 'dotenv'
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import { JwtPayload } from "jsonwebtoken";

dotenv.config()
export class RoomController {
  constructor() {

  }
  async enterRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { roomName, roomId } = req.query
      console.log("checking room", roomName, roomId);


    } catch (error) {

    }

  }
  async getToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const userName = user.name
      const { channelName, uid } = req.query;
      const UID = parseInt(uid as string, 10);
      const APP_ID = process.env.APP_ID;
      const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
  
      if (!APP_ID || !APP_CERTIFICATE) {
        throw new Error('Missing APP_ID or APP_CERTIFICATE environment variables');
      }
  
      console.log("heyy token iam here");
  
      const tokenService = new TokenService(APP_ID, APP_CERTIFICATE);
      const privilegeExpiredTs = Math.floor(Date.now() / 1000) + 120;
      console.log("channelName:", typeof channelName); // Should be string
      console.log("uid:", typeof UID); // Should be number or string
      console.log("privilegeExpiredTs:", typeof privilegeExpiredTs); // Should be number
      
      const token = tokenService.generateRtcToken(channelName as string, UID, RtcRole.PUBLISHER, privilegeExpiredTs);
  
      console.log("got token", token);
  
      res.status(201).json({ status: "success", data: token,user:userName });
    } catch (error: any) {
      console.log("error got token", error);
      res.status(400).json({ message: error.message });
    }
  }

  // async verifyToken(token:string){
  //   const APP_ID = process.env.APP_ID;
  //   const APP_CERTIFICATE = process.env.APP_CERTIFICATE;
  //   try {
  //     if (!APP_ID || !APP_CERTIFICATE) {
  //       throw new Error('Missing APP_ID or APP_CERTIFICATE environment variables');
  //     }
  //     const tokenService = new TokenService(APP_ID, APP_CERTIFICATE);
  //     const decodedToken=tokenService.dec

      
  //   } catch (error) {
      
  //   }
  // }
}