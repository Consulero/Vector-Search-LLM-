const openai = require("openai");
const { Configuration, OpenAIApi } = openai;
const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { Pinecone } = require("@pinecone-database/pinecone");

require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openaiApi = new OpenAIApi(configuration);

const pinecone = createClient({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

const indexName = "llm";
const index = pinecone.Index(indexName);

async function loadFiles(directory) {
  const files = fs.readdirSync(directory);
  const texts = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(directory, file), "utf8");
    texts.push({ id: file, text: content });
  }
  return texts;
}

async function uploadDocuments(directory) {
  const documents = await loadFiles(directory);
  const embeddings = [];

  for (const doc of documents) {
    const response = await openaiApi.createEmbedding({
      model: "text-embedding-ada-002",
      input: doc.text,
    });
    embeddings.push({
      id: doc.id,
      values: response.data.data[0].embedding,
    });
  }

  await index.upsert({ vectors: embeddings });
  console.log("Documents uploaded to vector store.");
}

async function askQuestion(query) {
  const response = await index.query({
    query: query,
    topK: 1,
    includeMetadata: true,
  });

  const context =
    response.matches[0]?.metadata?.text || "No relevant context found.";
  const completion = await openaiApi.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: `Context: ${context}\n\nQuestion: ${query}` },
    ],
  });

  console.log(completion.data.choices[0].message.content.trim());
}

// Main Chat Loop
async function chatLoop() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt("Prompt: ");
  rl.prompt();

  rl.on("line", async (line) => {
    if (line.trim().toLowerCase() === "exit") rl.close();
    else {
      await askQuestion(line.trim());
      rl.prompt();
    }
  });

  rl.on("close", () => {
    console.log("Goodbye!");
    process.exit(0);
  });
}

// Initialize
(async () => {
  const directory = "./data"; // Directory containing text files
  await uploadDocuments(directory); // Upload and embed docs
  chatLoop(); // Start chat loop
})();


require("dotenv").config();
const { PineconeStore } = require("@langchain/pinecone");
const { OpenAIEmbeddings } = require("@langchain/openai");

const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
// const { OpenAIEmbeddings } = require('langchain/embeddings/openai');
// const { RecursiveCharacterTextSplitter } = require('langchain/text_splitter');
// const { OpenAI } = require('langchain/llms/openai');
// const { PineconeStore } = require('langchain/vectorstores/pinecone');

async function vectorSearch() {
 

  //   // Load PDFs from a directory
  const loader = new DirectoryLoader("./data", { recursive: true });
  const documents = await loader.load();

  // Split documents into manageable chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = splitter.splitDocuments(documents);

  console.log("============>", splitDocs);

  //   // Create and store embeddings in Pinecone
  //   await PineconeStore.fromDocuments(
  //     splitDocs,
  //     new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
  //     {
  //       pineconeIndex: index,
  //     }
  //   );

  //   console.log('Indexing complete!');
}

vectorSearch().catch((err) => console.error("Error indexing PDFs:", err));
