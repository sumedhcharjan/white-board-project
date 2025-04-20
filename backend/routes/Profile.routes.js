import express from 'express'
import { deleteDrawing, sendSavedDrawings } from '../controllers/Users.controller.js';
const router=express.Router();


router.get('/:userid/savedDrawings',sendSavedDrawings);
router.delete('/:userid/deleteDrawing',deleteDrawing);
export default router;