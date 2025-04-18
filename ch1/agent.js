import 'dotenv/config';

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";

// Define the tools for the agent to use
const agentTools = [new TavilySearchResults({ maxResults: 3, apiKey: process.env.TAVILY_API_KEY })];
const agentModel = new ChatGoogleGenerativeAI({ model: "gemini-1.5-flash",temperature: 0, apiKey: process.env.GOOGLE_API_KEYy });

// Initialize memory to persist state between graph runs
const agentCheckpointer = new MemorySaver();
const agent = createReactAgent({
  llm: agentModel,
  tools: agentTools,
  checkpointSaver: agentCheckpointer,
});


// Now it's time to use!
const agentFinalState = await agent.invoke(
    { messages: [new HumanMessage("List of countries")] },
    { configurable: { thread_id: "42" } },
  );
  
  console.log(
    agentFinalState.messages[agentFinalState.messages.length - 1].content,
  );
  
  const agentNextState = await agent.invoke(
    { messages: [new HumanMessage("what about newyork")] },
    { configurable: { thread_id: "42" } },
  );
  
  console.log(
    agentNextState.messages[agentNextState.messages.length - 1].content,
  );