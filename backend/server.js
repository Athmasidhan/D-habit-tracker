import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongoDB.js'
import userRouter from './routes/userRouter.js'

const app = express()
const PORT = process.env.PORT || 4000

// ✅ Fix: Enable CORS with credentials and specific origin
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

connectDB()

app.use('/api/user', userRouter)

app.listen(PORT, () => {
    console.log(`🚀 Server connected to PORT : ${PORT}`);
})

// qpQqieubzquEpVmv