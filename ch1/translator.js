import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import 'dotenv/config';


const model = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.5,
  maxToken: 50,
  apiKey: process.env.GOOGLE_API_KEYy,
});

const systemTemplate = "Translate the following from English into {language} in proper and give only 1 answer that is most relevant ,among all.";

const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate],
    ["user", "{text}"],
  ])

const messages = [
    new SystemMessage("Translate the following from English into Japanese"),
    new HumanMessage("What are you doing!"),
];

const textValue = "My name is Nikesh.";
 
const promptValue = await promptTemplate.invoke({
    language: "Japanese",
    text: textValue,
});

// console.log(promptValue);

const response  = await model.invoke(promptValue);
console.log(textValue)
console.log(response.content);