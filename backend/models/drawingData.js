import mongoose from "mongoose";

const PointSchema = new mongoose.Schema({
  x: { type: Number, required: true ,default:0},
  y: { type: Number, required: true ,default:0}
});

const DrawingElementSchema = new mongoose.Schema({
  type: { type: String, required: true },  
  color: { type: String, required: true },
  width: { type: Number, required: true },
  points: {
    type: [PointSchema],
    required: true,
    
  },
});

const RoomDrawingSchema = new mongoose.Schema({
  roomid: {
    type: String,
    unique: true,
    required: true
  },
  drawingData: {
    type: [DrawingElementSchema],  
    default: []
  }
});

const RoomDrawing = mongoose.model('RoomDrawing', RoomDrawingSchema);
export default RoomDrawing