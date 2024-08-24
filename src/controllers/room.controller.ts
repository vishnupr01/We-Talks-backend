import { NextFunction, Response, Request } from "express";
import { TokenService } from "../frameworks/utils/rtc";
import { RtcRole } from "agora-access-token";

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

  async getToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { channelName, uid } = req.query
      const UID = parseInt(uid as string)
      const APP_ID = process.env.APP_ID
      const APP_CERTIFICATE = process.env.APP_CERTIFICATE
      const tokenService = new TokenService(APP_ID as string, APP_CERTIFICATE as string)
      const token = tokenService.generateRtcToken(channelName as string, UID, RtcRole.PUBLISHER, 10000)
      res.status(201).json({ status: "success", data: token })
    } catch (error: any) {
      res.status(400).json({ message: error.message })

    }
  }

}