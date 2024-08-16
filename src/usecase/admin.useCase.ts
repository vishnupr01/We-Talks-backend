import { ErrorCode } from "../enums/errorCodes";
import IAdminRepository from "../interfaces/repositories/IAdmin.repository";
import IAdminUseCase from "../interfaces/usecase/IAdmin.usecase";

export class AdminUsecase implements IAdminUseCase {
  private adminRepository: IAdminRepository;

  constructor(adminRepository: IAdminRepository) {
    this.adminRepository = adminRepository;
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
  async getAllUsers(page:number){
    try {
      const Users=await this.adminRepository.getUsers(page)
      if(!Users){
       throw new Error("Error in loading")
      }
      return Users  
    } catch (error) {
       throw error
    }
   
}
async blockingUser(email:string): Promise<boolean> {
  try {

    
    const isBlocked=await this.adminRepository.blockUser(email)
    console.log(isBlocked);
    
    if(!isBlocked){
      throw new Error("server error")
    }
   return isBlocked
  } catch (error) {
    throw error
  }
}
async unBlockingUser(email:string): Promise<boolean> {
  try {
   
    const isBlocked=await this.adminRepository.unblockUser(email)
    if(!isBlocked){
      throw new Error("server error")
    }
   return isBlocked
  } catch (error) {
    throw error
  }
}
}
