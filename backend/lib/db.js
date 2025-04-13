import { config } from 'dotenv';
import mongoose from 'mongoose';
config();
export const connectDb=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DataBase:"+conn.connection.host);
    } catch (error) {
        console.log("Enable To connect DataBase",error)
    }

}