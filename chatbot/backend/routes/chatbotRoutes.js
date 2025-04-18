import express from 'express';
import { handleChatbotRequest } from '../controllers/chatbotController.js';

const router = express.Router();

router.post('/query', handleChatbotRequest);

export default router;
