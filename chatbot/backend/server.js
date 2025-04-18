import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatbotRoutes from './routes/chatbotRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use('/api', chatbotRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
