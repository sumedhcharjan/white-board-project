import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import Room from '../models/Room.model.js';
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: ['http://localhost:5173'] }
})

io.on('connection', (socket) => {
    console.log('🟢 User Connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('🔴 User Disconnected:', socket.id);
    })

    socket.on('joinroom', ({ roomid, name, userid }) => {
        socket.join(roomid);
        console.log("Join Room");
        socket.id = userid;
    });
    socket.on('leaveroom', ({ roomid, name }) => {
        socket.leave(roomid);
        console.log("uioii");
        // socket.to(roomid).emit('User Left',{name});
    });
    socket.on('KickOut', ({ roomid, userid, username }) => {
        console.log(userid);
        socket.to(roomid).emit('User Kicked', username)
    })
    socket.on('sendChat', async ({ roomid, name, sender, message }) => {
        try {

            if (!message.trim()) return; // Ignore empty messages
            // console.log(message);
            const timestamps = new Date().toISOString();
            console.log(typeof (name), typeof (sender), typeof (message), typeof (timestamps));
            const room = await Room.findOne({ roomid });
            if (!room) console.log("Room Not Found!");
            // console.log(room.messages.size());
            room.messages.push({ name, sender, message });
            await room.save();
            console.log('saved Room Success!');
            // console.log(room.messages);
            const umessages=room.messages;
            // console.log(umessages);
            io.to(roomid).emit('receiveChat', umessages);
        } catch (error) {
            console.error("saving messages error:", error);
        }
    })
})
export { io, server, app };