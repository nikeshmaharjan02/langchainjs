import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatPromptTemplate} from '@langchain/core/prompts';
import { StringOutputParser, CommaSeparatedListOutputParser, StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

// import * as dotenv from 'dotenv';
// dotenv.config();

import 'dotenv/config'

const model = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEYy,
});

async function callStringOutputParser() {
    //create prompt template
    // const prompt = ChatPromptTemplate.fromTemplate(
    //     'You are a comedian. Tell a joke for a following word {input}'
    // );

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", "Generate a poem based on a word provided by user"],
        ["human","{input}"],
    ]);

    //create parser
    const parser = new StringOutputParser();

    // console.log(await prompt.format({ input: "goat"}));

    //create a chain
    const chain = prompt.pipe(model).pipe(parser);

    //call a chain
    // const response = await chain.invoke({ 
    //     input: "girl"
    // });
    return await chain.invoke({
        input: "girl"
    });

}

async function callListOutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Provide five synonyms, separated by commas, for following word {input}
    `)

    const outputParser = new CommaSeparatedListOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        input: "sad",
    });

}

//structured output parser
//with this we can convert the response in js object
async function callStructuredParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}
    `);
    const outputParser = StructuredOutputParser.fromNamesAndDescriptions({
        name: "the name of the person",
        age: "the age of a person",
    });
    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase: "Nik is 30 years old",
        format_instructions: outputParser.getFormatInstructions(),
    });
}

async function callZodOutputParser() {
    const prompt = ChatPromptTemplate.fromTemplate(`
        Extract information from the following phrase.
        Formatting Instructions: {format_instructions}
        Phrase: {phrase}
    `);

    const outputParser = StructuredOutputParser.fromZodSchema(
        z.object({
            receipe: z.string().describe("name of receipe"),
            ingridents: z.array(z.string()).describe("ingridents"),
        })
    );
    const chain = prompt.pipe(model).pipe(outputParser);

    return await chain.invoke({
        phrase: "THe ingridents for the Spaghetti Bolognese receipe are tomatoes, minced beef, garlic, wine and herbs.",
        format_instructions: outputParser.getFormatInstructions(),
    });
}

// const response = await callStringOutputParser();
// const response = await callListOutputParser();
// const response = await callStructuredParser();
const response = await callZodOutputParser();

console.log(response);