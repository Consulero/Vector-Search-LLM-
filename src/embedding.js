require("dotenv").config();
const { OpenAIEmbeddings } = require("@langchain/openai");
const { ChatOpenAI } = require("@langchain/openai");

module.exports = {
  async embedData(chunk) {
    try {
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        model: "text-embedding-3-small", // Dimensions:1536 , Metric:cosine
      });
      const embeddedData = await embeddings.embedQuery(chunk);
      return embeddedData;
    } catch (e) {
      console.log(e);
    }
  },

  async chatModel() {
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0,
      maxTokens: 1000,
      timeout: undefined,
      maxRetries: 2,
      apiKey: process.env.OPENAI_API_KEY,
    });

    return llm;
  },
};
