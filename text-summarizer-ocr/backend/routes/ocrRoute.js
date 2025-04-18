import express from 'express';
import upload from "../middlewares/multer.js"
import { imageOCRController,  pdfOCRController, queryOCRController} from '../controllers/ocrController.js';


const router = express.Router();


router.post('/image', upload.array('files', 10), imageOCRController);
router.post('/pdf', upload.single('file'), pdfOCRController);
router.post('/query',  queryOCRController);

export default router;