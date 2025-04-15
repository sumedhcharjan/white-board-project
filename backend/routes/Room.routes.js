import express from 'express'
import { createRoom, joinRoom, Kickuser, LeaveRoom, replyRequest, SendRoomdetails } from '../controllers/Room.controller.js';

const router=express.Router();

router.post('/create',createRoom);
router.put('/joinroom',joinRoom);
router.put('/leave',LeaveRoom);
router.get('/roomdetails/:roomid',SendRoomdetails);
router.put('/kickout',Kickuser);
router.put('/request/p',replyRequest);
export default router;