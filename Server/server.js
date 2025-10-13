import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import creditRouter from "./routes/creditRouter.js"

const app=express()



app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Server in running")
})

app.use('/api/user',userRouter);
app.use('/api/chat',chatRouter);
app.use('/api/message',messageRouter);
app.use('/api/credit',creditRouter);

const PORT=process.env.PORT || 3000
app.listen(PORT,()=>{
    console.log(`Server is running on the ${PORT}`)
     connectDB();
})