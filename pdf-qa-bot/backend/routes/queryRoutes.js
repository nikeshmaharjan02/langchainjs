import express from 'express';
import { queryPDF } from '../controllers/queryController.js';

const router = express.Router();
router.post('/', queryPDF);

export default router;
