import express from 'express';
import cors from 'cors';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatPromptTemplate} from '@langchain/core/prompts';
import 'dotenv/config';

//app config
const app = express();
const port = process.env.PORT;

// middlewares
app.use(express.json());
app.use(cors());

// Initialize LangChain model with API key from .env
const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEYy,
    temperature: 0.7, //higher temperature means more randomness and creativity while lower means more deterministic focuss and safe
    maxTokens: 10, //maxTokens parameter controls the maximum number of tokens (words or characters) the model can generate in a single response.
    topP:1 //Controls the diversity of responses (higher = more diverse, lower = more predictable)
    
});

//create prompt template
const prompt = ChatPromptTemplate.fromTemplate(
    'Answer the following question: {question}'
);


//create a chain
const chain = prompt.pipe(model);


// Define a POST route to handle the user query
app.post('/query', async (req, res) => {
    const { question } = req.body;

     // Validate if the question is provided
     if (!question) {
        return res.status(400).json({ error: 'Please provide a question.' });
    }
    try {
        // Call the LangChain model with the user's question
        const response = await chain.invoke({ question });
         
        res.json({ answer: response.text });
    } catch (error) {
        console.error("Error during LangChain query:", error);
        res.status(500).json({ error: 'Error processing your request' });
    }
});

app.get('/',(req,res)=>{
    res.send("API WORKING");
});

app.listen(port, ()=> console.log("Server Started",port));