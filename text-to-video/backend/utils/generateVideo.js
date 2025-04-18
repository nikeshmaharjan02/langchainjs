// utils/generateVideo.js
import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';

const API_URL = "https://api-inference.huggingface.co/models/damo-vilab/modelscope-text-to-video-synthesis";
const OUTPUT_FILE = "output.mp4";

export async function generateVideoFromText(prompt) {
  const API_KEY = process.env.HUGGING_FACE_API_KEY;
  console.log("API Key:", process.env.HUGGING_FACE_API_KEY);

  if (!API_KEY) {
    throw new Error("Missing Hugging Face API key. Check .env file.");
  }

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    Accept: "application/json",
    'Content-Type': "application/json"
  };

  const data = { inputs: prompt };

  const response = await axios.post(API_URL, data, {
    headers,
    responseType: "arraybuffer", // For binary video data
    timeout: 300000 // 5 mins timeout (slow model)
  });

  fs.writeFileSync(OUTPUT_FILE, response.data);
}
