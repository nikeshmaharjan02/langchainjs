import { WeaviateStore } from "@langchain/weaviate";
import weaviate from 'weaviate-ts-client';
import { getEmbeddings } from '../utils/embeddings.js';
import 'dotenv/config';

let vectorStore;
let client;

export const initializeWeaviateDB = async () => {
   client = weaviate.client({
    scheme: "https",
    host: process.env.WCD_URL,
    apiKey: new weaviate.ApiKey(process.env.WCD_API_KEY),
  });

  const embeddings = await getEmbeddings();

  // New vector store, not using existing index
  vectorStore = new WeaviateStore(embeddings, {
    client,
    indexName: 'PdfQa', // this can be any name
    textKey: 'text',
    metadataKeys: ["source"],           
  });

  console.log('✅ Weaviate DB initialized');
};

export const getVectorStore = () => vectorStore;
export const getWeaviateClient = () => client;
