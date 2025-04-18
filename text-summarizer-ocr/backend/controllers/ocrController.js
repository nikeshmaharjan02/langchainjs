import fs from 'fs';
import path from 'path';
import pdfPoppler from 'pdf-poppler'; // Correct import
import tesseract from 'tesseract.js';
import { summarizeText } from '../utils/summarize.js';
import { storeInDb } from '../utils/vectorDB.js';
import vectorStore from "../utils/weaviate.js";
import { model } from "../model/model.js"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const TEMP_DIR = path.join(process.cwd(), 'temp'); // Folder to save converted images

export const pdfOCRController = async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "Please upload a PDF file." });
    }

    const pdfPath = req.file.path;

    // Convert PDF to image per page
    const options = {
      format: 'jpeg',
      out_dir: TEMP_DIR,
      out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
      page: null, // Convert all pages
    };

    // Convert PDF to images
    await pdfPoppler.convert(pdfPath, options); // Use the correct method

    // Get all generated images in order
    const imageFiles = fs.readdirSync(TEMP_DIR)
      .filter(file => file.startsWith(path.basename(pdfPath, path.extname(pdfPath))))
      .sort();

    let combinedText = '';

    for (const img of imageFiles) {
      const imgPath = path.join(TEMP_DIR, img);
      const { data: { text } } = await tesseract.recognize(imgPath, 'eng');
      combinedText += text + '\n\n';

      fs.unlinkSync(imgPath); // Clean temp image after processing
    }

    await storeInDb(combinedText);

    const summary = await summarizeText(combinedText);

    // Save extracted and summarized text to a .txt file
    const outputTextPath = path.join(TEMP_DIR, `${Date.now()}-output.txt`);
    const fileContent = `Extracted Text:\n\n${combinedText}\n\nSummary:\n\n${summary}`;
    fs.writeFileSync(outputTextPath, fileContent);

    res.json({ success: true, extracted: combinedText, summary });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export const imageOCRController = async (req,res)=>{
    try {
        if (!req.files || req.files.length === 0) {
            return res.json({ success: false, message: "Please select image files to upload" });
        }
        let combinedText = '';
        for (const file of req.files) {
            const imagePath = file.path;

            const result = await tesseract.recognize(imagePath, 'eng');  
            combinedText += result.data.text + '\n\n';
        }
        await storeInDb(combinedText);
        const summary = await summarizeText(combinedText);
        res.json({ success:true, extracted: combinedText,  summary : summary });
    } catch (error) {
        console.log(error)
        res.json({success:false, message: error.message})
    }
}

export const queryOCRController = async (req,res)=>{
  try {
    const { question } = req.body;
    if (!question) {
      return res.json({ success: false, answer: 'Please provide a question' });
    }
    const retriever = vectorStore.asRetriever();

    const prompt = ChatPromptTemplate.fromTemplate(`
      Answer the user's question as clearly as possible based only on the following context:
      ---------------------
      {context}
      ---------------------
      Question: {input}
    `);

    const combineDocsChain = await createStuffDocumentsChain({
      llm:model,
      prompt,
    });  

    const retrievalChain = await createRetrievalChain({
      retriever,
      combineDocsChain,
    });

    const response = await retrievalChain.invoke({
      input: question,
    });

    if (!response || !response.answer) {
      return res.json({ success: false, answer: '❌ No content available' });
    }

    res.json({ success: true, answer: response.answer });
  } catch (error) {
    console.error("Error in query:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}