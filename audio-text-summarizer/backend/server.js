import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import audioRoute from './routes/audioRoute.js'

const app = express(); 
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));


app.use('/api/audio', audioRoute);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});