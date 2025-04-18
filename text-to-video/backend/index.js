// index.js
import dotenv from 'dotenv';
import { generateVideoFromText } from './utils/generateVideo.js';

dotenv.config();

const prompt = "A cute robot dancing in a futuristic city";

(async () => {
  try {
    console.log("🎬 Generating video...");
    await generateVideoFromText(prompt);
    console.log("✅ Video saved as output.mp4");
  } catch (error) {
    console.error("❌ Error generating video:", error.message);
  }
})();
