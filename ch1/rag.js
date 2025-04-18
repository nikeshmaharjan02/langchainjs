import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import 'dotenv/config';

import "cheerio";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { z } from "zod";


import { tool } from "@langchain/core/tools";

// Initialize Google Generative AI model
const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",  // You can replace this with another model like GPT-4
  temperature: 0.5,
  maxToken: 150,
  apiKey: process.env.GOOGLE_API_KEYy, // Make sure to add the correct API key to .env
});


// Load and chunk contents of blog
const pTagSelector = "p";
const cheerioLoader = new CheerioWebBaseLoader(
  "https://lilianweng.github.io/posts/2023-06-23-agent/",
  {
    selector: pTagSelector
  }
);

const docs = await cheerioLoader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, chunkOverlap: 200
});
const allSplits = await splitter.splitDocuments(docs);

const totalDocuments = allSplits.length;
const third = Math.floor(totalDocuments / 3);

allSplits.forEach((document, i) => {
  if (i < third) {
    document.metadata["section"] = "beginning";
  } else if (i < 2 * third) {
    document.metadata["section"] = "middle";
  } else {
    document.metadata["section"] = "end";
  }
});
// console.log(allSplits[1].metadata);


// Initialize the embedding model and vector store (Chroma)
const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "embedding-001",   
  apiKey: process.env.GOOGLE_API_KEYy,  
});

const vectorStoreQA = new MemoryVectorStore(embeddings);
await vectorStoreQA.addDocuments(allSplits);

const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test1-collection",
});

// Index the chunks into the vector store
await vectorStore.addDocuments(allSplits);

const searchSchema = z.object({
  query: z.string().describe("Search query to run."),
  section: z.enum(["beginning", "middle", "end"]).describe("Section to query."),
});

const structuredLlm = model.withStructuredOutput(searchSchema);

// Define a tool for generating refined queries based on user input or conversation history
const queryRewriteTool = tool(async ({ userInput, context }) => {
  // Logic for query rewriting (this could be more sophisticated, based on the history)
  const refinedQuery = `${userInput} related to ${context}`;
  return refinedQuery;  // This is the refined query used for the retrieval step
}, {
  name: "queryRewriteTool",
  description: "A tool to rewrite queries based on the user's input and context.",
  schema: z.object({
    userInput: z.string().describe("The user's current query."),
    context: z.string().describe("The context or previous conversation history."),
  }),
});

// The application logic: Retrieve relevant documents and generate the answer
const retrieve = async (question, section) => {
  // Define a filter based on the 'section' metadata
  const filter = (doc) => doc.metadata.section === section;

  const retrievedDocs = await vectorStore.similaritySearch(question); // Perform similarity search
  const filteredDocs = retrievedDocs.filter(filter);
  // console.log(retrievedDocs.length)
  // console.log(retrievedDocs)
  const context = retrievedDocs.filter(doc => doc.metadata.section === section).map(doc => doc.pageContent).join("\n")
  return context;
};


// Define the RAG prompt template
const systemTemplate = `
You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. 
If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise.
Question: {question}
Context: {context}
`;

// Create the prompt template for generating answers
const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system", systemTemplate],
  ["user", "{question}"],  // The user's question
]);



// const analyzeQuery = async (question) => {
//   // Use the structured model to generate the query and section
//   const result = await structuredLlm.invoke(question);
//   return result;
// };

const generate = async (question, context) => {
  const messages = await promptTemplate.invoke({
    question: question,
    context: context,
  });
  const response = await model.invoke(messages);  // Generate the final answer
  return response.content;
};


// Conversation history manager
const conversationHistory = [];
const MAX_HISTORY = 5;



// Main function to handle user question and generate the answer
const getAnswer = async (question) => {
  conversationHistory.push(question);

  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory.shift();
  }

  const historyContext = conversationHistory.join(". ");
  const refinedQuery = await queryRewriteTool.invoke({ userInput: question, context: historyContext });
  const structuredQuery = await structuredLlm.invoke(refinedQuery);
  
  console.log("Structured Query:", structuredQuery);

  // Retrieve the relevant context from the vector store
  const context = await retrieve(structuredQuery.query, structuredQuery.section);

  // Generate the answer using the chat model
  const answer = await generate(question, context);
  conversationHistory.push(answer);

  return answer;

  // console.log(`Question: ${question}`);
  // console.log(`Answer: ${answer}`);
};

// Test the application with a sample question
// const question = "Who is Amit Joshi";
// const question = "Can you tell me about the challenges:Finite context length that are in end of document?";
// await getAnswer(question);

// Example Usage
console.log(await getAnswer("LLM"));
// Simple delay function
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Call getAnswer after 4 seconds
async function runWithDelay() {
  await delay(4000);  // 4-second delay
  console.log(await getAnswer("What are their several key components?"));
}

runWithDelay();
