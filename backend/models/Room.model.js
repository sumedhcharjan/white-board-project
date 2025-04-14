import mongoose from 'mongoose'

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
        id: { type: String, required: true },
        name: { type: String, required: true },
      }
    ]
  }, { timestamps: true });

  const Room = mongoose.model("Room", RoomSchema);
  export default Room;