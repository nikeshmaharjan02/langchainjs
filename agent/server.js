import express from "express";
import "dotenv/config";
import { exampleTool } from "./src/agent.js";

const app = express();

const port = process.env.PORT;

await exampleTool();

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})