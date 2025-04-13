import express from 'express'
import { createRoom, joinRoom, LeaveRoom } from '../controllers/Room.controller.js';

const router=express.Router();

router.post('/create',createRoom);
router.put('/joinroom',joinRoom);
router.put('/leave',LeaveRoom);
export default router;