import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const getEmbeddings = async () => {
  return new GoogleGenerativeAIEmbeddings({
    model: 'embedding-001',
    apiKey: process.env.GOOGLE_API_KEYy,
  });
};

