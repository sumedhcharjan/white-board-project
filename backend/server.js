import { config } from 'dotenv';
import express from 'express'
import cors from 'cors'
import { connectDb } from './lib/db.js';
import RoomRoutes from './routes/Room.routes.js';
config();

const app = express();
const P = process.env.port;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());

app.use('/api/room', RoomRoutes);

app.listen(P, () => {
    console.log(`Server is running on ${P}`);
    connectDb();
})