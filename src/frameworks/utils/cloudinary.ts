import * as cloudinary from 'cloudinary'
import { UploadApiResponse } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()


cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
  secure: true
})

export class CloudinaryService{
  async uploadImage(image:string):Promise<string>{

    
    try {
      
      const result:UploadApiResponse=await cloudinary.v2.uploader.upload(image,{folder:'Wetalks'})
     
      return result.secure_url
      
      
    } catch (error) {
      
      console.log(error);
      throw error
      
    }
  }
}