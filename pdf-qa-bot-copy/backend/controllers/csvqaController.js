import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore } from '../config/weaviateDB.js';
import fs from 'fs';

export const uploadCSV = async (req, res) => {
    try {
        const filePath = req.file.path;
        if (!filePath) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        // console.log("File path:", filePath);
        const loader = new CSVLoader(filePath);
        const docs = await loader.load();
        // console.log("Docs length:", docs.length); // csv file sanga 10 ota row xa 10 dinxa
        // console.log(docs[0]); // csv file ko pahilo row ko data dinxa
        // console.log(docs[1]); // csv file ko dosro row ko data dinxa

        const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
        const chunks = await splitter.splitDocuments(docs);
        // console.log("Chunks length:", chunks.length); //RecursiveCharacterTextSplitter is smart: it only splits if content > chunkSize.
        
        await getVectorStore().addDocuments(chunks);

        fs.unlinkSync(filePath); // Remove file after processing
        res.json({ success:true,message: '✅ CSV uploaded and processed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};