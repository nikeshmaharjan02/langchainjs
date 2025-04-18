import express from 'express';
import { query } from '../controllers/queryController.js';

const router = express.Router();
router.post('/', query);

export default router;
