import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';


import csvRoutes from './routes/csvRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import queryRoutes from './routes/queryRoutes.js'

import { initializeWeaviateDB } from './config/weaviateDB.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api/pdf', pdfRoutes);
app.use('/api/csv', csvRoutes);
app.use('/api/query', queryRoutes);



// Initialize ChromaDB
initializeWeaviateDB();

app.listen(port, () => console.log("Server running on port " + port));
