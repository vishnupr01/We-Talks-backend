import mongoose from 'mongoose'
import dotenv from 'dotenv';

dotenv.config();
const mongoUrl=process.env.MONGO_URI
if(!mongoUrl){
  console.error("mongourl is not defined")
  process.exit(1)  
}

const connectDB= async()=>{
  try {
    const con=await mongoose.connect(mongoUrl,{dbName:"SecondProject"})
    console.log(`mongodb connected:${con.connection.host}`);
    
  } catch (error) {
    console.log(error);
    setTimeout(connectDB,5000)
    
  }
}
export default connectDB