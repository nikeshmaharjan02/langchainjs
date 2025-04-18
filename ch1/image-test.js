import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEYy);

// Load and prepare the image
const imagePath = path.resolve("C:\\Users\\Acer\\Desktop\\langchainjs\\ch1\\files\\chart.png");
const imageBuffer = fs.readFileSync(imagePath);
const base64Image = imageBuffer.toString("base64");

function getImageParts() {
  return {
    inlineData: {
      mimeType: "image/jpeg", // Change if using PNG, etc.
      data: base64Image,
    },
  };
}

async function generateCaption() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    { text: "Describe for this image about words . Be accurate and not random." },
    getImageParts(),
  ]);

  const response = await result.response;
  const caption = response.text();

  console.log("📸 Caption:", caption);
}

generateCaption();
