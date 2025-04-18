import RoomDrawing from "../models/drawingData.js"
import { io } from "../lib/socket.js"

export const createRoomDrawing = async ({roomid}) => {
  try {

    const newRoom = {
      roomid: `${roomid}`,
      drawingData: []
    }
    await RoomDrawing.create(newRoom)
  } catch (e) {
      console.log(e);
  }
}

export const getElements = async (req, res) => {
  const { roomid } = req.query;
  console.log("this is it bro", roomid);

  try {
      const room = await RoomDrawing.findOne({ roomid });
      if (!room) return res.status(404).json({ msg: 'Room not found' });

      res.status(200).json({ drawingData: room.drawingData });
  } catch (error) {
      console.error('Error fetching drawing data:', error);
      res.status(500).json({ msg: 'Server error' });
  }
}

export const clearElements = async (req, res) => {
  const { roomid } = req.query;
  try {
      const room = await RoomDrawing.findOne({ roomid });
      if (!room) return res.status(404).json({ msg: 'Room not found' });

      room.drawingData = [];
      await room.save();
      io.emit('clearcanvas');

      res.status(200).json({ msg: 'Room cleared successfully!' });
  } catch (error) {
      console.error('Error clearing room:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};



export const addMockData = async () => {

  console.log("added mock data");
    const mockData = [
      {
        roomid: 'room123',
        drawingData: [
          {
            type: 'freehand',
            color: '#FF5733', 
            width: 5,
            points: [
              { x: 10, y: 20 },
              { x: 15, y: 25 },
              { x: 20, y: 30 },
              { x: 25, y: 35 }
            ]
          }
        ]
      },
      {
        roomid: 'room124', // Room ID
        drawingData: [
          {
            type: 'freehand',
            color: '#33FF57', // Green color
            width: 3,
            points: [
              { x: 50, y: 60 },
              { x: 55, y: 65 },
              { x: 60, y: 70 },
              { x: 65, y: 75 }
            ]
          }
        ]
      },
      {
        roomid: 'room125', // Room ID
        drawingData: [
          {
            type: 'freehand',
            color: '#3357FF', // Blue color
            width: 4,
            points: [
              { x: 100, y: 110 },
              { x: 110, y: 120 },
              { x: 120, y: 130 },
              { x: 130, y: 140 }
            ]
          }
        ]
      }
    ];
  
    try {
      // Insert mock data into the database
      for (let data of mockData) {
        await RoomDrawing.create(data);  // This will add each room and its drawing data
      }
      console.log('Mock data added successfully');
    } catch (error) {
      console.error('Error adding mock data:', error);
    }
};
