import { nanoid } from "nanoid";
import Room from "../models/Room.model.js";
import { io } from '../lib/socket.js'
export const createRoom = async (req, res) => {
    try {
        const { user } = req.body;

        if (!user || !user.sub) {
            return res.status(400).json({ msg: "Invalid user data" });
        }

        const roomid = nanoid(6);

        const room = new Room({
            roomid,
            hostuser: user.sub,
            participants: [],
            messages:[]
        });

        await room.save();

        res.status(200).json({ roomid });
    } catch (error) {
        console.error("Create room error:", error);
        res.status(500).json({ msg: "Server error", error });
    }
};

export const joinRoom = async (req, res) => {
    try {
        const { user, Rid } = req.body;
        const userId = user.sub;
        const userName = user.name || user.nickname || "Anonymous";

        const room = await Room.findOne({ roomid: Rid });
        if (!room) return res.status(404).json({ msg: 'Room not found' });

        const isAlreadyParticipant = room.participants.some(p => p.id === userId);
        if (isAlreadyParticipant) return res.status(400).json({ msg: 'Already in room' });
        const cd=(userId===room.hostuser);
        console.log(cd);
        room.participants.push({ id: userId, name: userName,candraw:cd});
        await room.save();
        io.to(Rid).emit('User Joined', { name: userName, userId });
        io.to(Rid).emit('participantsUpdate', room.participants)
        io.to(Rid).emit('joinroom', {
            name: userName,
            roomid: Rid,
            userid: userId,
        })
        res.status(200).json({ msg: 'Joined room', room });
    } catch (error) {
        console.error("Join room error:", error);
        res.status(500).json({ msg: "Server error", error });
    }
};
export const LeaveRoom = async (req, res) => {
    const { roomid, user } = req.body;
    try {
        const room = await Room.findOne({ roomid });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const userId = user.sub;
        const userName = user.name || user.nickname || 'Anonymous';

        if (userId === room.hostuser) {
            await Room.findOneAndDelete({ roomid });
            io.to(roomid).emit('hostEndedMeeting', { message: 'Host ended the meeting' });
            io.to(roomid).emit('participantsUpdate', []); // Empty array for consistency
            return res.status(200).json({ msg: 'Host ended the meeting' });
        }
        const participant = room.participants.find(p => p.id === userId);
        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }
        room.participants = room.participants.filter(p => p.id !== userId);
        await room.save();

        io.to(roomid).emit('participantsUpdate', room.participants);
        io.to(roomid).emit('User Left', { name: userName, userId });
        res.json({ msg: 'Left the room successfully', participants: room.participants });
    } catch (error) {
        console.error('Error leaving room:', error.message, error.stack);
        res.status(500).json({ error: 'Server error' });
    }
};

export const SendRoomdetails = async (req, res) => {
    try {
        const { roomid } = req.params;
        console.log(roomid);
        const room = await Room.findOne({ roomid: roomid });
        if (!room) return res.status(404).json({ msg: "Room not found" });

        res.json(room);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }

}
export const Kickuser = async (req, res) => {
    try {
        const { userid, hostid, roomid } = req.body;
        const room = await Room.findOne({ roomid: roomid });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        if (room.hostuser !== hostid) return res.status(404).json({ error: 'Only Host Can Kick participants' });
        const participant = room.participants.find(p => p.id === userid);
        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }
        room.participants = room.participants.filter(p => p.id !== userid);
        await room.save();

        io.to(roomid).emit('participantsUpdate', room.participants);
        io.to(roomid).emit('Kickout', { userid, name: participant.name });
        res.json({ msg: 'Participant kicked out successfully', participants: room.participants });
    } catch (error) {
        console.error('Error kicking out participant:', error);
        res.status(500).json({ error: 'Server error' });
    }
}

export const replyRequest = async (params) => {
    try {

    } catch (error) {
        console.error('Error kicking out participant:', error);
        res.status(500).json({ error: 'Server error' });
    }
}