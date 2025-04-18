import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import vectorStore from "./weaviate.js";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const storeInDb = async (combinedText) => {
    /*
  const nike10kPdfPath = "./src/nke-10k-2023.pdf";

  const loader = new PDFLoader(nike10kPdfPath);

  const docs = await loader.load();
    */
  const docs = [{ pageContent: combinedText, metadata: { source: "ocr" } }];
  

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const allSplits = await splitter.splitDocuments(docs);

  // Index chunks
  const data = await vectorStore.addDocuments(allSplits);

  // console.log("data are stored succefully", data);
};
