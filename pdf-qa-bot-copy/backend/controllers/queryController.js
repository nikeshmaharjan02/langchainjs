import { getVectorStore } from '../config/weaviateDB.js';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

export const query = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.json({ success: false, answer: 'Please provide a question' });
    }

    const vectorStore = getVectorStore();
    const retriever = vectorStore.asRetriever();

    const llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEYy,
      model: "gemini-1.5-flash"
    });

    const prompt = ChatPromptTemplate.fromTemplate(`
      Answer the user's question as clearly as possible based only on the following context:
      ---------------------
      {context}
      ---------------------
      Question: {input}
    `);

    const combineDocsChain = await createStuffDocumentsChain({
      llm,
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
};
