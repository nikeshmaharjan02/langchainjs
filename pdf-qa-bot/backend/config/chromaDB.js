import { Chroma } from "@langchain/community/vectorstores/chroma";
import { getEmbeddings } from '../utils/embeddings.js';

let vectorStore;

export const initializeChromaDB = async () => {
  vectorStore = new Chroma(await getEmbeddings(), {
    collectionName: 'pdf-qa-collection',
});
  console.log('✅ ChromaDB initialized');
};

export const getVectorStore = () => vectorStore;



