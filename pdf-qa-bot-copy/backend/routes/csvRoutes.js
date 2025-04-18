import express from 'express';
import { uploadCSV } from '../controllers/csvqaController.js';
import upload from "../middlewares/multer.js"

const router = express.Router();
router.post('/upload', upload.single('csv'), uploadCSV);


export default router;
