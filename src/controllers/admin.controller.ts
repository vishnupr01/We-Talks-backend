import { NextFunction, Request, Response } from "express";
import IAdminUseCase from "../interfaces/usecase/IAdmin.usecase";
import { createJWT } from "../frameworks/utils/jwt.token";
import { AuthenticatedRequest } from "../frameworks/middlewares/adminmidleware";
import { IUserUseCase } from "../interfaces/usecase/IUser.usecase";
import { IPostUseCase } from "../interfaces/usecase/IPost.useCase";

export default class AdminController {
  private adminUsecase: IAdminUseCase;
  private userUsecase: IUserUseCase
  private postUsecase: IPostUseCase
  constructor(adminUsecase: IAdminUseCase, userUsecase: IUserUseCase, postUsecase: IPostUseCase) {
    this.adminUsecase = adminUsecase;
    this.userUsecase = userUsecase
    this.postUsecase = postUsecase
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(401).json({ message: "Email and password are required" });
      }

      const isAdmin = await this.adminUsecase.adminLogin(email, password); // Await the async operation

      if (!isAdmin) {
        return res.status(400).json({ message: "Invalid password or email" });
      }

      const AdminName = "A";
      const payload = { email: email, name: AdminName };
      const token = createJWT(payload, 5);

      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
      });

      res.status(200).json({ status: "success" });
    } catch (error: any) {
      console.log(error);

      res.status(400).json({ message: error.message });
    }
  }

  async isAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (req.admin) {
        console.log("API working");
        return res.status(200).json({ message: "Admin is authenticated", admin: req.admin });
      } else {
        return res.status(200).json({ message: "Admin is not authenticated" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async loadUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page: number = req.query.page as any
      const Users = await this.adminUsecase.getAllUsers(page)
      res.status(200).json({ status: 'success', data: Users })
    } catch (error) {
      throw error
    }
  }
  async userBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const blocked = await this.adminUsecase.blockingUser(email)
      res.status(200).json({ status: 'success', data: blocked })

    } catch (error) {
      throw error
    }
  }
  async userUnBlock(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      console.log("hey function");

      const blocked = await this.adminUsecase.unBlockingUser(email)
      console.log("unblocked");

      res.status(200).json({ status: 'success', data: blocked })

    } catch (error) {
      throw error
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params

      const response = await this.userUsecase.getUserProfile(userId)

      res.status(200).json({ status: "success", data: response })

    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }


  async deleteAdminPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.query
      const response = await this.postUsecase.deletePost(postId as string)
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }

  async detailsDay(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.dayDetails()
      res.status(201).json({ status: "success", data: response })
    } catch (error: any) {
      res.status(400).json({ message: error.message })
    }
  }
  async detailsMonth(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.monthDetails();
      res.status(201).json({ status: "success", data: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async detailsYear(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.yearDetails();
      res.status(201).json({ status: "success", data: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
  async totalDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.detailsTotal()
      res.status(201).json({ status: "success", data: response });

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllReports(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.adminUsecase.allReports()
      res.status(201).json({ status: "success", data: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getSinglePostDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId,reportId } = req.query
      console.log("reportId",reportId);
      
      const response = await this.adminUsecase.getSinglePost(postId as string,reportId as string )
      res.status(201).json({ status: "success", data: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });

    }
  }
  async blockPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.body;
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }

      const blocked = await this.adminUsecase.blockPost(postId);
      res.status(200).json({ status: 'success', data: blocked });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }


  async unblockPost(req: Request, res: Response, next: NextFunction) {
    try {
      const { postId } = req.body;
      if (!postId) {
        return res.status(400).json({ message: "Post ID is required" });
      }

      const unblocked = await this.adminUsecase.unblockPost(postId);
      res.status(200).json({ status: 'success', data: unblocked });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getAllBlockedPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 10;

      const response = await this.adminUsecase.getAllBlockedPosts(page, limit);
      res.status(200).json({ status: 'success', data: response });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

}
