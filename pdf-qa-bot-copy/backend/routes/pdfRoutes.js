import express from 'express';
import { uploadPDF, deletePDF } from '../controllers/pdfqaController.js';
import upload from "../middlewares/multer.js"

const router = express.Router();
router.post('/upload', upload.single('pdf'), uploadPDF);
router.delete('/delete', deletePDF);

export default router;
