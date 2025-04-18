import express from 'express';
import 'dotenv/config';
import weaviateRoutes from './routes/weaviateRoutes.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/weaviate', weaviateRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});