import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from '../routes/auth.route'
import adminRouter from '../routes/admin.route'
import postRouter from '../routes/post.route'
import userRouter from '../routes/user.route'
import commentRouter from '../routes/comment.route'
import messageRouter from '../routes/message.route'
import notificationRouter from '../routes/notification.route'
import roomRouter from '../routes/room.routes'



const app = express()

dotenv.config()

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

const allowOrgins = [
  'http://localhost:5173'
]
app.use(cors({
  origin: allowOrgins,
  optionsSuccessStatus: 200,
  credentials: true

}))

app.use(cookieParser())

//auth route
app.use('/api/auth', authRouter)
console.log("call coming unblock");

app.use('/api/admin', adminRouter)
console.log("api for post");

app.use('/api/post/', postRouter)
console.log("hello");

app.use('/api/user/', userRouter)

app.use('/api/comment/', commentRouter)
console.log("route reacher");

app.use('/api/messages/', messageRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/room/',roomRouter)



app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error('error not found') as any
  error.statusCode = 401
  console.log(error);
  next(error)

})


export default app