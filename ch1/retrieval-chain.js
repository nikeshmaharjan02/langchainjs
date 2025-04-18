import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import {ChatPromptTemplate} from '@langchain/core/prompts';

import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import {createRetrievalChain} from 'langchain/chains/retrieval';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import 'dotenv/config'

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEYy,
});


// create prompt template
const prompt = ChatPromptTemplate.fromTemplate(
    `Answer the user's question.
    Context: {context}
    {input}`
);


//create a chain
// const chain = prompt.pipe(model);
const chain = await createStuffDocumentsChain({
    llm: model,
    prompt: prompt,
});

// load data from webpage
const loader = new CheerioWebBaseLoader(
    "https://js.langchain.com/v0.1/docs/expression_language/"
);
const docs = await loader.load();
// console.log(docs);

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments(docs);
// console.log(splitDocs);

const embeddings = new GoogleGenerativeAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings
);


// *************Retrieving Data***********
const retriever = vectorStore.asRetriever({
    k: 2, //amount of document that should be returned
});

const retrievalChain = await createRetrievalChain({
    combineDocsChain: chain,
    retriever
});

//call a chain
const response = await retrievalChain.invoke({ 
    input: "What is LCEL?",
    // context: docs, //as docs is an array of documents
});

console.log(response);
// console.log(docs[0].pageContent.length);