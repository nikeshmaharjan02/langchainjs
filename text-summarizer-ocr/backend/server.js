import express from 'express';
import 'dotenv/config'

import ocrRoutes from './routes/ocrRoute.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/ocr',ocrRoutes);

app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
});
