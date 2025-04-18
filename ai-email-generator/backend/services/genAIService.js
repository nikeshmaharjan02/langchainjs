import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import 'dotenv/config';



const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEYy,
  model: "gemini-2.0-flash",
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful AI that writes well-structured emails based on bullet points and a selected tone."],
  ["human", "Tone: {tone}\nBullet Points:\n{points}\n\nGenerate a full email:"],
]);

export const generateEmailFromPoints = async (bulletPoints, tone) => {
  const formattedPoints = bulletPoints
    .split("\n")
    .map((point) => `- ${point.trim()}`)
    .join("\n");

  const chain = prompt.pipe(model);
  const response = await chain.invoke({
    tone,
    points: formattedPoints,
  });

  return response.content;
};
