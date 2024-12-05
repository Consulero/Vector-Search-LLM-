require("dotenv").config();
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");
module.exports = {
  async pineconeIndex() {
    try {
      const pinecone = new Pinecone();
      const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
      console.log(pineconeIndex);
    } catch (e) {
      console.log(e);
    }
  },
};
