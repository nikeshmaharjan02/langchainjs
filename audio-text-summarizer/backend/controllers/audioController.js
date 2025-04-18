import {
    AudioTranscriptLoader,
} from "@langchain/community/document_loaders/web/assemblyai";
import fs from "fs";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import multer from 'multer';  // Make sure multer is imported in the controller
import 'dotenv/config';  

import { ElevenLabsClient } from "elevenlabs";
import path from "path";  // for handling audio file path
import { v4 as uuidv4 } from 'uuid'; // for unique file names



// Controller function
export const uploadAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No audio file uploaded." });
        }

        const localPath = req.file.path;

        // Initialize the AudioTranscriptLoader to transcribe the audio
        const loader = new AudioTranscriptLoader(
            {
                audio: localPath,
                language_code: "es" || "hi",
            },
            {
                apiKey: process.env.ASSEMBLYAI_API_KEY,
            }
        );

        // Load and get the transcription document
        const docs = await loader.load();

        // Extract the text (pageContent) from the docs and concatenate it into a single string
        const transcriptText = docs.map(doc => doc.pageContent).join("\n");
        // console.log("Transcription text:", transcriptText);  

        // Initialize the model for Google Generative AI
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-1.5-flash",
            temperature: 0.7,
            apiKey: process.env.GOOGLE_API_KEYy,  // Replace with actual API key
        });


        // The formatted prompt must be an array of messages (like SystemMessage, HumanMessage)
        const messages = [
            new SystemMessage('Summarize the following according to context only about 70 to 80 words'),
            new HumanMessage(transcriptText),
        ];

        // Send the formatted prompt to the AI model to get the summary
        const summaryResponse = await model.invoke( messages );
        const summaryText = summaryResponse.content;
        // Clean up the file by deleting it after processing
        fs.unlinkSync(localPath);

        const client = new ElevenLabsClient({
            apiKey: process.env.ELEVEN_LABS_API_KEY,
        });

        const ttsResponse = await client.textToSpeech.convert("JBFqnCBsd6RMkjVDRZzb", {
            output_format: "mp3_44100_128",
            text: summaryText,
            model_id: "eleven_multilingual_v2",
        });

        //  Save the audio to disk
        const audioFileName = `summary-${uuidv4()}.mp3`;
        const audioFilePath = path.join("uploads", audioFileName); // ensure "uploads/" exists

        const writeStream = fs.createWriteStream(audioFilePath);
        ttsResponse.pipe(writeStream);


        writeStream.on("finish", () => {
            // Response after audio is saved
            res.status(200).json({
                success: true,
                message: "Audio uploaded, summarized, and converted to speech successfully",
                summary: summaryText,
                audioFile: audioFilePath,
            });
        });
    } catch (error) {
        console.log(error);  // Log the error for debugging purposes

        // Handle Multer file upload errors
        if (error instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: `File upload error: ${error.message}`,
            });
        }

        // Handle invalid file type or other custom errors
        if (error.message && error.message.includes("Invalid file type")) {
            return res.status(400).json({
                success: false,
                message: "Invalid file type. Only audio files are allowed.",
            });
        }

        // General error handler for unexpected errors
        res.status(500).json({ success: false, message: "Error uploading and processing audio." });
    }
};
