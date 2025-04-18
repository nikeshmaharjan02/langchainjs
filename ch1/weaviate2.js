import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { WeaviateStore } from "@langchain/weaviate";
import weaviate from "weaviate-ts-client";
import 'dotenv/config';

// Initialize the model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.5,
  maxToken: 50,
  apiKey: process.env.GOOGLE_API_KEYy,  // Fixed the typo
});

// Initialize embeddings
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "embedding-001",
  apiKey: process.env.GOOGLE_API_KEYy,  // Use OpenAI's API key here if needed
});

// Load the document
const loader = new TextLoader("C:\\Users\\Acer\\Desktop\\langchainjs\\ch1\\files\\test.txt");
const docs = await loader.load();

// Split the document into chunks
const splitter = new CharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 0,
});
const documents = await splitter.splitDocuments(docs);
console.log(documents.length);

// Weaviate client setup
const wcdUrl = process.env.WCD_URL;
const wcdApiKey = process.env.WCD_API_KEY;


const weaviateClient = weaviate.client({
    scheme: "https",
    host: process.env.WCD_URL,
    apiKey: new weaviate.ApiKey(process.env.WCD_API_KEY),
});



// Create the Weaviate vector store with the correct client
const vectorStore = new WeaviateStore(embeddings, {
    client: weaviateClient,
    indexName: "Langchainjs_test",
    textKey: "text",  // Optional, default value
    metadataKeys: ["source"],  // Optional, can set your custom metadata keys
});

const retriever = await vectorStore.addDocuments(documents);



const similaritySearchResults = await vectorStore.similaritySearch("Provide some information on king john",2);
// console.log("Similarity Search Results:", similaritySearchResults);

const systemTemplate = `
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. 
If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
`;

// Create the prompt template for generating answers
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{question}"],
]);

// Generate answers based on the question
const generate = async (question) => {
  const context =  await vectorStore.similaritySearch(question,3)  // Retrieve context
  const messages = await promptTemplate.invoke({
    question: question,
    context: context,
  });
  const response = await model.invoke(messages);
  return response.content;
};

// Test generating an answer
const response = await generate("Write the moral of this story");
console.log(response);