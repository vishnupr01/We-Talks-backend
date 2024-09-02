import IPost from "../entities/post.entity";
import { IReport } from "../entities/report.entity";
import { ErrorCode } from "../enums/errorCodes";
import IAdminRepository from "../interfaces/repositories/IAdmin.repository";
import { IPostRepository } from "../interfaces/repositories/IPost.repository";
import IAdminUseCase from "../interfaces/usecase/IAdmin.usecase";

export class AdminUsecase implements IAdminUseCase {
  private adminRepository: IAdminRepository;
  private postRepository: IPostRepository
  constructor(adminRepository: IAdminRepository, postRepository: IPostRepository) {
    this.adminRepository = adminRepository;
    this.postRepository = postRepository
  }

  async adminLogin(email: string, password: string): Promise<boolean> {
    if (email !== process.env.ADMIN_EMAIL) {
      throw new Error("Email is not valid");
    }
    if (password !== process.env.ADMIN_PASS) {
      throw new Error(ErrorCode.PASSWORD_INCORRECT);
    }
    return true; // Successfully authenticated
  }
  async getAllUsers(page: number) {
    try {
      const Users = await this.adminRepository.getUsers(page)
      if (!Users) {
        throw new Error("Error in loading")
      }
      return Users
    } catch (error) {
      throw error
    }

  }
  async blockingUser(email: string): Promise<boolean> {
    try {


      const isBlocked = await this.adminRepository.blockUser(email)
      console.log(isBlocked);

      if (!isBlocked) {
        throw new Error("server error")
      }
      return isBlocked
    } catch (error) {
      throw error
    }
  }
  async unBlockingUser(email: string): Promise<boolean> {
    try {

      const isBlocked = await this.adminRepository.unblockUser(email)
      if (!isBlocked) {
        throw new Error("server error")
      }
      return isBlocked
    } catch (error) {
      throw error
    }
  }
  async dayDetails(): Promise<{ users: number[], posts: number[] }> {
    try {
      const response = await this.adminRepository.detailsDay();
      if (!response) {
        throw new Error("Server error");
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async monthDetails(): Promise<{ users: number[], posts: number[] }> {
    try {
      const response = await this.adminRepository.detailsMonth();
      if (!response) {
        throw new Error("Server error");
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async yearDetails(): Promise<{ users: number[], posts: number[] }> {
    try {
      const response = await this.adminRepository.detailsYear();
      if (!response) {
        throw new Error("Server error");
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async detailsTotal(): Promise<{ users: number, posts: number }> {
    try {
      const response = await this.adminRepository.totalDetails()
      if (!response) {
        throw new Error("server error")
      }
      return response

    } catch (error) {
      throw error
    }
  }

  async allReports(): Promise<IReport[]> {
    try {
      const response = await this.adminRepository.getAllReports()
      if (!response) {
        throw new Error("server Error")
      }
      return response

    } catch (error) {
      throw error
    }
  }

  async getSinglePost(postId: string,reportId:string): Promise<IPost[]> {
    try {
      if (!postId) {
        throw new Error("credential server error")
      }
      const response = await this.adminRepository.getSingleReportDetails(reportId)
      return response
    } catch (error) {
      throw error
    }
  }
  async blockPost(postId: string): Promise<boolean> {
    try {
      const isBlocked = await this.adminRepository.blockPost(postId);
      if (!isBlocked) {
        throw new Error("Failed to block post");
      }
      return isBlocked;
    } catch (error) {
      throw error;
    }
  }


  async unblockPost(postId: string): Promise<boolean> {
    try {
      const isUnblocked = await this.adminRepository.unblockPost(postId);
      if (!isUnblocked) {
        throw new Error("Failed to unblock post");
      }
      return isUnblocked;
    } catch (error) {
      throw error;
    }
  }


  async getAllBlockedPosts(page: number = 1, limit: number = 10): Promise<{ posts: IPost[], totalBlockedPosts: number }> {
    try {
      const response = await this.adminRepository.getAllBlockedPosts(page, limit);
      if (!response) {
        throw new Error("Failed to fetch blocked posts");
      }
      return response;
    } catch (error) {
      throw error;
    }
  }


}



