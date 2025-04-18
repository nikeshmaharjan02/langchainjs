import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatPromptTemplate} from '@langchain/core/prompts';
import * as dotenv from 'dotenv';
dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEYy,
});

//create prompt template
// const prompt = ChatPromptTemplate.fromTemplate(
//     'You are a comedian. Tell a joke for a following word {input}'
// );

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "Generate a joke based on a word provided by user"],
    ["human","{input}"],
])

// console.log(await prompt.format({ input: "goat"}));

//create a chain
const chain = prompt.pipe(model);

//call a chain
const response = await chain.invoke({ 
    input: "dog"
});

console.log(response);