import mongoose, { Types } from "mongoose";

const RoomSchema = new mongoose.Schema({
    roomid: {
        type: String,
        unique: true,
        required: true,
    },
    hostuser: {
        type: String,
        required: true,
    },
    participants: [
        {
            type: String,
        }
    ]
}, { timestamps: true });

const Room = mongoose.model("Room", RoomSchema);
export default Room;