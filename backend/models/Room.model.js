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
      candraw:{type:Boolean,required:true,default:false}
    }
  ],
  messages: [
    {
      name: { type: String, required: true },
      sender: { type: String, required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, required: true,default:Date.now()},
    }
  ]
}, { timestamps: true });

const Room = mongoose.model("Room", RoomSchema);
export default Room;