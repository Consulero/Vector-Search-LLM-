require("dotenv").config();
const { OpenAIEmbeddings } = require("@langchain/openai");

module.exports = {
  async embedData(chunk) {
    try {
      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
      });
      const embeddedData = await embeddings.embedQuery(chunk);
      return embeddedData;
    } catch (e) {
      console.log(e);
    }
  },
};
