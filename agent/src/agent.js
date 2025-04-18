import {createReactAgent} from "@langchain/langgraph/prebuilt";
import {tool} from "@langchain/core/tools";
import { model } from "./model.js";
import {z} from "zod";


export const exampleTool = async()=>{
    const getWeather = tool((input) => {
        if (['ktm', 'Kathmandu'].includes(input.location.toLowerCase())) {
          return 'It\'s 20 degrees and sunny.';
        } else if( ['pkr', 'Pokhara'].includes(input.location.toLowerCase())){
            return 'It\'s 15 degrees and rainy.';
        } else if( ['bir', 'Biratnagar'].includes(input.location.toLowerCase())){
            return 'It\'s 45 degrees and very very sunny.';
        } else {
          return 'It\'s 5 degrees and cold.';
        }
    }, {
        name: 'get_weather',
        description: 'Call to get the current weather.',
        schema: z.object({
          location: z.string().describe("Location to get the weather for."),
        })
    });

      const getCoolestCities = tool(() => {
        return 'everest, ktm';
      }, {
        name: 'get_coolest_cities',
        description: 'Get a list of coolest cities',
        schema: z.object({
          noOp: z.string().optional().describe("No-op parameter."),
        })
      })
    
    const agent = new createReactAgent({
        llm:model,
        tools:[getWeather, getCoolestCities],
    })
    
    const result = await agent.invoke({
        messages:[
            {
                role:"user",
                content:"What is the temperature of New York?",
            }
        ]
    })
    
    console.log(result.messages.at(-1).content) // the temprature in ktm is 20 degree;
}
