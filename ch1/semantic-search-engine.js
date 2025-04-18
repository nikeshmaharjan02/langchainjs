import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import 'dotenv/config'

/* These libraries allow you to load a PDF file, split it into chunks, generate embeddings, 
and store them in a vector database for efficient retrieval. */



/* Creates two Document objects with sample text.

  Adds metadata (source: "mammal-pets-doc") for reference. 
*/

const documents = [
  new Document({
    pageContent:
      "Dogs are great companions, known for their loyalty and friendliness.",
    metadata: { source: "mammal-pets-doc" },
  }),
  new Document({
    pageContent: "Cats are independent pets that often enjoy their own space.",
    metadata: { source: "mammal-pets-doc" },
  }),
];


const loader = new PDFLoader("./files/nke-10k-2023.pdf"); //initializes the PDF loader.

const docs = await loader.load(); //extracts text from the PDF and stores it as a list of Document objects.
console.log(docs.length); //prints the number of extracted documents.
// console.log(docs[0].pageContent.slice(0, 200));
// console.log(docs[0].metadata);


const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000, //Splits text into chunks of 1000 characters.
  chunkOverlap: 200, //Ensures chunks overlap by 200 characters for better context retention.
});

const allSplits = await textSplitter.splitDocuments(docs);  //Splits the PDF content into multiple chunks.

console.log(allSplits.length);


const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "embedding-001",   
    apiKey: process.env.GOOGLE_API_KEYy,  
});

const vector1 = await embeddings.embedQuery(allSplits[0].pageContent);
const vector2 = await embeddings.embedQuery(allSplits[1].pageContent);

console.assert(vector1.length === vector2.length);  //Ensures both vectors have the same dimensions.
// console.log(`Generated vectors of length ${vector2.length}\n`);
console.log(vector1.slice(0, 10)); // Prints the first 10 numbers of the vector.


const vectorStore = new Chroma(embeddings, {
  collectionName: "a-test-collection",
});  //Creates a ChromaDB vector store named "a-test-collection".

await vectorStore.addDocuments(allSplits); //Stores all text chunks (allSplits) as vectors in the database.

const results1 = await vectorStore.similaritySearch(
    "When was Nike incorporated?"
);

const results2 = await vectorStore.similaritySearchWithScore(
  "What was Nike's revenue in 2023?"
);

const results4 = await vectorStore.similaritySearchWithScore(
  "Write about Internationals Market?"
);


const embedding = await embeddings.embedQuery(
  "How were Nike's margins impacted in 2023?"
); //Converts "How were Nike's margins impacted in 2023?" into an embedding.



const results3 = await vectorStore.similaritySearchVectorWithScore(
  embedding,
  1
); //Searches for the most relevant document based on numerical similarity.


const retriever = vectorStore.asRetriever({
  searchType: "similarity", // similarity ko thau ma mmr user gareko tara support garena dekhayo.
  searchKwargs: {
    fetchK: 1, // This fetches only 1 relevant document
  },
}); //Converts ChromaDB into a retriever for searching documents.

/*A retriever is useful for chatbot applications where you need to fetch specific answers. */

const result6 = await retriever.batch([
  "When was Nike incorporated?",
  "What was Nike's revenue in 2023?",
]);

console.log(result6);
  
// console.log(results1[0]);
// console.log(results2[0]);
// console.log(results3[0]);


//************************FInal thought *******************************8

/*
  You’re building a RAG (Retrieval-Augmented Generation) system that extracts text from PDFs, stores embeddings, and retrieves relevant answers.

  ChromaDB is used as a vector database for storing and retrieving text efficiently.

  Google AI embeddings help in generating better search results.

  Batch processing allows for efficient querying.
 */