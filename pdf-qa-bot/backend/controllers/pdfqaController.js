import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from '../config/chromaDB.js';
import fs from 'fs';

export const uploadPDF = async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("File path:", filePath);
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const chunks = await splitter.splitDocuments(docs);
    console.log("Chunks length:", chunks.length);


    await getVectorStore().addDocuments(chunks);

    fs.unlinkSync(filePath); // Remove file after processing
    res.json({ success:true,message: '✅ PDF uploaded and processed successfully' });
  } catch (error) {
      console.log(error)
      res.status(500).json({success:false,message:error.message})
  }
};
