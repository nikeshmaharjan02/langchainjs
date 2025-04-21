import express from 'express';
import 'dotenv/config'
import cors from 'cors';
import connectDB from './config/mongodb.js'

import ocrRoutes from './routes/ocrRoute.js'

const app = express();
const port = process.env.PORT || 3000;
connectDB();

app.use(express.json());
app.use(cors());
app.use('/api/ocr',ocrRoutes);

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
});
