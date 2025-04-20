import { config } from 'dotenv';
import express from 'express'
import cors from 'cors'
import { connectDb } from './lib/db.js';
import RoomRoutes from './routes/Room.routes.js';
import ProfileRoutes from './routes/Profile.routes.js'
import { app, server } from './lib/socket.js';
config();
const P = process.env.port;
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());

app.use('/api/room', RoomRoutes);
app.use('/api/profile',ProfileRoutes);

server.listen(P, () => {
    console.log(`Server is running on ${P}`);
    connectDb();
})