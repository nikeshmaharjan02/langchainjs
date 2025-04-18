import expres from 'express';
import { uploadAudio } from '../controllers/audioController.js';

import { upload } from "../middlewares/multer.js";

const router = expres.Router();

router.post('/upload',upload.single("audio"), uploadAudio);

export default router;