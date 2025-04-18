// static document not from site
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatPromptTemplate} from '@langchain/core/prompts';
import {GoogleGenerativeAIEmbeddings} from '@langchain/google-genai'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

import {Document} from '@langchain/core/documents';
import 'dotenv/config'


const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEYy,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004", 
    
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

//Documents
const documentA = new Document({
    pageContent: "LangChain Expression Language, or LCEL, is a declarative way to easily compose chains together. LCEL was designed from day 1 to support putting prototypes in production, with no code changes, from the simplest “prompt + LLM” chain to the most complex chains (we’ve seen folks successfully run LCEL chains with 100s of steps in production)."
});

const documentB = new Document({
    pageContent: "The passphrase is LANGCHAIN IS AEWESOME",
});

//call a chain
const response = await chain.invoke({ 
    input: "What is passphrase?",
    context: [ documentA, documentB ],
});


console.log(response);