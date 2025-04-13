import { nanoid } from "nanoid";
import Room from "../models/Room.model.js";

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
        console.log(Rid);
        const userId = user.sub;
        const room = await Room.findOne({ roomid: Rid });
        if (!room) return res.status(404).json({ msg: 'Room not found' });
        if (room.participants.includes(userId)) return res.status(400).json({ msg: 'Already in room' });
        room.participants.push(userId);
        await room.save();
        res.status(200).json({ msg: 'Joined room', room });
    } catch (error) {
        console.error("Create room error:", error);
        res.status(500).json({ msg: "Server error", error });
    }
}

export const LeaveRoom = async (req, res) => {
    try {
        const { user, roomid } = req.body;
        console.log(roomid);
        const userId = user.sub;
        const room = await Room.findOne({ roomid});
        if (!room) return res.status(404).json({ msg: 'Room not found' });
        if (!room.participants.includes(userId)) return res.status(400).json({ msg: 'Already not in room' });
        if(room.hostuser===userId){
            await Room.deleteOne({ roomid });
            res.status(200).json({ msg: 'Host ended the meeting!' });
        }
        const uroom = await Room.findOneAndUpdate({ roomid}, {
            '$pull': { participants: userId }
        }, { new: true });
        res.status(200).json({ msg: 'Left the room successfully' });
    } catch (error) {
        res.status(500).json({ msg: "Server error", error });
    }
}
