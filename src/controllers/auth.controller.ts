import { NextFunction, Request, Response } from "express";
import { IAuthUsecase } from "../interfaces/usecase/IAuth.usecase";
import { AuthenticatedRequest } from "../frameworks/middlewares/authmiddlewares";
import { createJWT, verifyJWT } from "../frameworks/utils/jwt.token";
import { JwtPayload } from "jsonwebtoken";
export class AuthController {
  private authUsecase: IAuthUsecase
  constructor(authUsecase: IAuthUsecase) {
    this.authUsecase = authUsecase
  }

  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body
      console.log("nnn", req.body);

      const data = await this.authUsecase.userSignup(body)
      console.log(data);

      const userEmail = data.email
      res.cookie('userEmail', userEmail, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000, // 5 minutes in milliseconds
        secure: process.env.NODE_ENV === 'production',
      });

      res.status(200).json({ status: 'success', data: data })

    } catch (error: any) {
      if (error.message === "Email_ALREADY_EXISTS") {
        console.log("yessss");

        return res.status(400).json({ message: "Email_ALREADY_EXISTS" })
      }
      res.status(400).json({ message: error.message })
    }
  }
  async googleSignup(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body
      console.log("nnn", req.body);


      const user = await this.authUsecase.googleSignup(body)
      console.log("google data", user)
      const data = {
        user: user
      }
      if (user.status === "gooogle") {
        const token = user.token
        if (token) {
          res.cookie('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
          })
        }

        res.status(200).json({ status: 'success', data: user })
        return
      }

      res.status(200).json({ status: 'success', data: data })


    } catch (error: any) {
      console.log(error, "email caught");
      res.status(400).json({ message: error.message })
    }
  }
  async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const response = await this.authUsecase.resendOtp(email, "otp for WETALKS")
      res.status(200).json({ status: 'success', data: response })

    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })

    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body
      if (!body?.email || !body?.otp) {
        throw new Error("missing email or Otp")
      }
      const data = await this.authUsecase.verifyOtp(body.email, body.otp)


      res.status(200).json({ status: "success", data: data })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  isUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    // console.log("api working not");
    // console.log(req.user);

    if (req.user) {
      console.log("api working ");
      return res.status(200).json({ message: 'user is authenticated', user: req.user })
    } else {
      return res.status(200).json({ message: 'user is not authenticated' })
    }
  }
  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body
      console.log(body.password);

      if (!body?.email || !body?.password) {
        throw new Error("Email and password are required")
      }
      const { token, refreshToken } = await this.authUsecase.userSignin(body)
      console.log("toke", token);
      if (token === "user is Blocked") {
        res.status(200).json({ data: token })
        return
      }
      if (token === "user is not verified") {
        res.status(200).json({ data: token })
        return
      }
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge:  15 * 24 * 60 * 60 * 1000 // 8 hours
      })
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge:  7 * 24 * 60 * 60 * 1000 // 8 hours
      })
      res.status(200).json({ status: 'success', data: token })

    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message })
    }
  }

  async logOut(req: Request, res: Response, next: NextFunction) {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none'
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });

  }

  async googleUpdateData(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id, userName, dob } = req.body
      const updated = await this.authUsecase.googleUpdate(_id, userName, dob)
      if (!updated) {
        throw new Error("Update failed")
      }
      const payload = { id: updated._id, userName: updated.name, email: updated.email, image_url: updated.profileImg }
      const token = createJWT(payload, 5)
      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
      })
      res.status(200).json({ status: 'success', message: 'updated successfully' });

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async isBlocked(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = req.user as JwtPayload
      const _id = user.id
      const response = await this.authUsecase.isBlocked(_id)
      if (response === true) {
        res.status(200).json({ status: 'success', message: 'Blocked' });
      } else {
        res.status(200).json({ status: 'failed', message: 'not blocked' });
      }

    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message })
    }
  }
  async forgotOtp(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("heyy");

      const { email } = req.body
      const isUser = await this.authUsecase.checkUser(email)
      const response = await this.authUsecase.resendOtp(email, "otp for WETALKS")
      res.status(200).json({ status: 'success', data: response })

    } catch (error: any) {
      console.log(error);
      if (error.message === "User not found") {
        console.log("predicted");
        res.status(400).json({ message: "User not found" });
      } else {
        res.status(400).json({ message: error.message });
      }


    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, newPassword } = req.body
      const result = await this.authUsecase.forgotPassword(email, newPassword)
      res.status(200).json({ status: 'success', data: result })
    } catch (error: any) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  async getToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const { authToken } = req.cookies
    res.status(200).json({ status: 'success', data: authToken })
  }

  async newToken(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("reaching newtoken");
      
      const { refreshToken } = req.cookies
      const user = verifyJWT(refreshToken) as JwtPayload
      if (!user) {
        throw new Error("servor token error")
      }
      const checkUser = await this.authUsecase.checkUser(user.email)
      if (!checkUser) {
        throw new Error("user not found")
      }
     
      
      const newPayload = { id: user._id, name: user.name, email: user.email, image_url: user.profileImg, isBlocked: user.isBlocked };
      const newAccessToken = createJWT(newPayload, '15m');
      console.log("new one",newAccessToken);
      
      res.cookie('authToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge:  15 * 24 * 60 * 60 * 1000 // 8 hours
      })

    } catch (error) {
 console.log(error)
 throw error;
 
    }
  }
}