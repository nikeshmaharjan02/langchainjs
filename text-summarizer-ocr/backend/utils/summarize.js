import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
dotenv.config();
import { model } from "../model/model.js";

const prompt = PromptTemplate.fromTemplate(`
  You are a helpful assistant. Summarize the following text in simple language in short:
  "{text}"
`);

export const summarizeText = async (text) => {
  const formattedPrompt = await prompt.format({ text });
  const response = await model.invoke(formattedPrompt);
  return response.content;
};
