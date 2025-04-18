import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import "dotenv/config"

export const model = new ChatGoogleGenerativeAI({
    model:"gemini-1.5-flash",
    apiKey: process.env.GOOGLE_API_KEYy,
})