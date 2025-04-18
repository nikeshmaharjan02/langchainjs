import express from "express";
import dotenv from 'dotenv';
import { test } from "./src/splitter.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

await test();

app.use(express.json());


app.listen(port, () => console.log("Server running on port " + port));
