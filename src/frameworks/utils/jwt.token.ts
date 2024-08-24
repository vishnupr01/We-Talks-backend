import * as jwt from 'jsonwebtoken'
const JWT_SECRET=process.env.JWT_SECRET || "secert_key"
const REFRESH_TOKEN_SECRET=process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key"

export function createJWT(payload:object,expiresIN:string | number):string{
const accessToken=jwt.sign(payload,JWT_SECRET,{expiresIn:"1d"})
return accessToken
}
export function createRefreshToken(payload: object): string {
  const refreshToken = jwt.sign(payload,JWT_SECRET, { expiresIn: '7d' });
  return refreshToken; 
}

export function verifyJWT<T>(token:string):T | null{
  try {
    console.log("any error");
    
    const decoded=jwt.verify(token,JWT_SECRET)
    return decoded as T
  } catch (error) {
    console.log(error);
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('TokenExpired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('InvalidToken');
    } else {
      throw new Error('JwtVerificationError');
    }
    
  }
}