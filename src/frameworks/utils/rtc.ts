import { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } from 'agora-access-token'


export class TokenService {
  appID: string
  appCertificate: string
  constructor(appID: string, appCertificate: string) {
    this.appID = appID
    this.appCertificate = appCertificate

  }
  generateRtcToken(channelName:string,uid:number,role:number,expirationTime:number){
    const currentTimeStamp=Math.floor(Date.now()/1000)
    const privilegeExpiredTs=currentTimeStamp +expirationTime
    return RtcTokenBuilder.buildTokenWithUid(this.appID, this.appCertificate, channelName, uid, role, privilegeExpiredTs)
  }
}