import express from 'express';
import { createCollection, loadData, queryCollection } from '../controllers/weaviateController.js';

const router = express.Router();

router.post('/create-collection', createCollection);
router.post('/load-data', loadData);
router.post('/query', queryCollection);

export default router;