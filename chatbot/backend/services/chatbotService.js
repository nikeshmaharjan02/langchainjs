import { model } from '../config/langchainConfig.js';
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from 'uuid';
import {
    START,
    END,
    MessagesAnnotation,
    StateGraph,
    MemorySaver,
} from "@langchain/langgraph";


// In-memory store for tracking conversations (Temporary, replace with DB for persistence)
const conversations = new Map();

// Define system prompt
const promptTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You talk like a chatbot. Answer all questions to the best of your ability, and remember previous interactions."],
    ["placeholder", "{messages}"],
]);

// Function to call the model with memory
const callModel = async (state) => {
    const { messages } = state; // Retrieve full conversation history

    // Generate the prompt by passing the full conversation history
    const prompt = await promptTemplate.invoke({ messages });

    // const lastUserMessage = messages[messages.length - 1]; // Get last user message

    // Generate prompt
    // const prompt = await promptTemplate.invoke({ question: lastUserMessage.content });

    // Get model response
    const response = await model.invoke(prompt);

    // Append response to conversation history
    return { messages: [...messages, { role: "assistant", content: response.text }] };
};

// Create a chatbot workflow
const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

// Add memory for conversation tracking
const chatbot = workflow.compile({ checkpointer: new MemorySaver() });

// Function to handle chatbot response
export const getChatbotResponse = async (question, threadId) => {
    try {
        if (!question) throw new Error("Please provide a question.");

        // Generate a unique thread ID if not provided
        let thread_id = threadId || uuidv4();

        // Retrieve past conversation or initialize new one
        let messages = conversations.get(thread_id) || [];

        // Log user message before adding it to conversation history
        console.log("User message:", question);

        // Append new user message
        messages.push({ role: "user", content: question });
       

        // Log the conversation history before invoking the model
        console.log("Conversation History before invoking the model:", messages);

        // Call chatbot with conversation history, ensuring thread_id is passed
        const response = await chatbot.invoke(
            { messages }, 
            { configurable: { thread_id } } // Ensure thread_id is included
        );

        // Log the model's response
        // console.log("Model's response:", response.messages[response.messages.length - 1].content);

        // Update conversation history in memory
        messages.push({ role: "assistant", content: response.messages[response.messages.length - 1].content });
        conversations.set(thread_id, messages);

        // Log conversations after assistant response
        console.log("Conversations after assistant response:", conversations);

        // Log updated conversation history
        // console.log("Updated conversation history:", messages);

        // Log the final response sent back to the user
        // console.log("Final chatbot response:", response.messages[response.messages.length - 1].content);

        return { text: response.messages[response.messages.length - 1].content, thread_id };
    } catch (error) {
        console.error("Error during LangChain query:", error);
        throw new Error("Error processing your request.");
    }
};
