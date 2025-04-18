import weaviate from 'weaviate-client';
import {  vectorizer, generative } from 'weaviate-client'

const wcdUrl = process.env.WCD_URL;
const wcdApiKey = process.env.WCD_API_KEY;
const cohereKey = process.env.COHERE_APIKEY
export const createCollection = async (req, res) => {
    try {
        // Connect to Weaviate Cloud
        const client = await weaviate.connectToWeaviateCloud(wcdUrl, {
          authCredentials: new weaviate.ApiKey(wcdApiKey),
        });
    
        // Create the collection
        await client.collections.create({
          name: 'FirstCollection',
          vectorizers: vectorizer.text2VecWeaviate(),
          generative: generative.cohere(),
        });
    
        // Close the client connection
        client.close();
    
        // Send success response
        res.status(200).send('Collection "FirstCollection" created successfully!');
      } catch (error) {
        console.error('Error creating collection:', error);
        res.status(500).send('Failed to create collection');
      }
};


// Function to fetch data from an external URL
async function getJsonData() {
    const response = await fetch(
      'https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json'
    );
    return response.json();
}
export const loadData = async (req, res) => {
    try {
        // Connect to Weaviate Cloud
        const client = await weaviate.connectToWeaviateCloud(wcdUrl, {
            authCredentials: new weaviate.ApiKey(wcdApiKey),
        });
    
        // Fetch the data from the external source
        const data = await getJsonData();
    
        // Get the "FirstCollection" and insert data
        const collection = client.collections.get('FirstCollection');
        const result = await collection.data.insertMany(data);
    
        console.log('Data insertion result: ', result);
    
        // Close the client connection
        client.close();
    
        // Send success response
        res.status(200).send('Data loaded successfully into "FirstCollection"!');
        
    } catch (error) {
        console.error('Error loading data:', error);
        res.status(500).send('Failed to load data');
        
    }
}

export const queryCollection = async (req, res) => {
    try {
        const {queryText} = req.body;
        // Connect to Weaviate Cloud
        const client = await weaviate.connectToWeaviateCloud(wcdUrl, {
            authCredentials: new weaviate.ApiKey(wcdApiKey),
            headers: {
                'X-Cohere-Api-Key': cohereKey,
            },
        });

        // Get the "FirstCollection" 
        const collection = client.collections.get('FirstCollection');/* 
        const result = await collection.query.nearText(queryText, {
            limit: 2,
        });
        */

        const result = await collection.generate.nearText(queryText,
            {
                groupedTask: 'Write a tweet with emojis about these facts.',
            },
            {
                limit: 2,
            }
        );
        // Output the query results in a structured format
        // const formattedResults = result.objects.map((item) => ({
        //     question: item.properties?.question,
        //     answer: item.properties?.answer,
        // }));
  
    
        // Close the client connection
        client.close();
    
        // Respond with the result
        res.status(200).json(result.generated);
    } catch (error) {
        console.error('Error querying collection:', error);
        res.status(500).send('Failed to query collection');
    }
}