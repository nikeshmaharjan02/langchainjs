import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';


import pdfRoutes from './routes/pdfRoutes.js';
import queryRoutes from './routes/queryRoutes.js'

import { initializeChromaDB } from './config/chromaDB.js';

dotenv.config();

const app = express();
const port = 6000;

app.use(express.json());
app.use(cors());

app.use('/api/pdf', pdfRoutes);
app.use('/api/query', queryRoutes);



// Initialize ChromaDB
initializeChromaDB();

app.listen(port, () => console.log("Server running on port " + port));
