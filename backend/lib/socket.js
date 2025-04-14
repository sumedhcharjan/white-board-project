import express from 'express'
import {Server} from 'socket.io'
import http from 'http'
const app=express();
const server=http.createServer(app);
const io=new Server(server,{
    cors:{origin:['http://localhost:5173']}
})

io.on('connection',(socket)=>{
    console.log('🟢 User Connected:',socket.id);

    socket.on('disconnect',()=>{
        console.log('🔴 User Disconnected:', socket.id);
    })

    socket.on('joinroom',({roomid,name,userid})=>{
        socket.join(roomid);
        console.log("Join Room");
        socket.id=userid;
        socket.to(roomid).emit('User Joined',{name});
    });
    socket.on('leaveroom',({roomid,name})=>{
        socket.leave(roomid);
        console.log("uioii");
        socket.to(roomid).emit('User Left',{name});
    });
    socket.on('KickOut',({roomid,userid,username})=>{
        console.log(userid);
        socket.to(roomid).emit('User Kicked',username)
    })
})
export {io,server,app};