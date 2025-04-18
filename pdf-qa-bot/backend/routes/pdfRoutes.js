import express from 'express';
import { uploadPDF } from '../controllers/pdfqaController.js';
import upload from "../middlewares/multer.js"

const router = express.Router();
router.post('/upload', upload.single('pdf'), uploadPDF);

export default router;
