import fs from 'fs';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from '@langchain/core/prompts';
import * as dotenv from 'dotenv';
dotenv.config();

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEYy,  // It's better to store API keys securely
});

// Load image and convert to base64
const imagePath = 'C:\\Users\\Acer\\Desktop\\langchainjs\\ch1\\files\\elephant.jpeg';
const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });

// Create a prompt template
const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Generate very short about  six to seven words captions based on input that is meaningful captions for images."],
    ["human", "Please generate a caption for the input image provided by the user and dont give random give caption based on image: {input}"],
]);
  

// Create a chain using the prompt and model
const chain = prompt.pipe(model);

// Call the chain with the base64-encoded image data
const response = await chain.invoke({ 
  input: `data:image/jpeg;base64,${base64Image}`,
});

console.log("📸 Caption:", response.content);
