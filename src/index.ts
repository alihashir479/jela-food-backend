import express, { Request, Response } from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import myUserRoute from './routes/MyUserRoute'

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string).then(() => console.log('DB is connected!'))

app.use('/api/my/user/', myUserRoute)

app.get('/health', (req: Request, res: Response) => {
  res.json({ message: 'Health is ok' })
})
// lWxpsgUoZ5zEntkw alihashir479
app.listen(7000, () => {
  console.log('listening on localhost:7000')  
})