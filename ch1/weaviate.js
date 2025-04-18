import weaviate from 'weaviate-client';
import {  vectorizer, generative } from 'weaviate-client'
import 'dotenv/config';


// Best practice: store your credentials in environment variables
const wcdUrl = process.env.WCD_URL;
const wcdApiKey = process.env.WCD_API_KEY;

async function main() {
  const client = await weaviate.connectToWeaviateCloud(
    wcdUrl, // Replace with your Weaviate Cloud URL
    {
      authCredentials: new weaviate.ApiKey(wcdApiKey), // Replace with your Weaviate Cloud API key
    }
  );
//   await client.collections.create({
//     name: 'Question',
//     vectorizers: vectorizer.text2VecWeaviate(),
//     generative: generative.cohere(),
//   });

//   const clientReadiness = await client.isReady();
//   console.log(clientReadiness); // Should return `true`


// Load data
async function getJsonData() {
    const file = await fetch(
      'https://raw.githubusercontent.com/weaviate-tutorials/quickstart/main/data/jeopardy_tiny.json'
    );
    return file.json();
  }
  
  // Note: The TS client does not have a `batch` method yet
  // We use `insertMany` instead, which sends all of the data in one request
//   async function importQuestions() {
//     const questions = client.collections.get('Question');
//     const data = await getJsonData();
//     const result = await questions.data.insertMany(data);
//     console.log('Insertion response: ', result);
//   }
  
//   await importQuestions();


    const questions = client.collections.get('Question');

    const result = await questions.query.nearText('biology', {
    limit: 2,
    });

    result.objects.forEach((item) => {
    console.log(JSON.stringify(item.properties, null, 2));
    });

    client.close(); // Close the client connection
    }

main().catch(err => {
  console.error("Error:", err);
});
