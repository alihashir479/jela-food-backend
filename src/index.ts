import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import myUserRoute from './routes/MyUserRoute'
import myResturantRoute from './routes/MyResturantRoute'
import resturantRoute from './routes/ResturantRoute'
import { v2 as cloudinary } from 'cloudinary'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log('DB is connected!'))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use('/api/my/user/', myUserRoute)
app.use('/api/my/resturant', myResturantRoute)
app.use('/api/resturant', resturantRoute)

app.get('/health', (req: Request, res: Response) => {
  res.json({ message: 'Health is ok' })
})
// lWxpsgUoZ5zEntkw alihashir479
app.listen(7000, () => {
  console.log('listening on localhost:7000')  
})