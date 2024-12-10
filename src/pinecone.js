require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");

module.exports = {
  async pineconeIndex() {
    try {
      const pinecone = new Pinecone();
      const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX);
      return pineconeIndex;
    } catch (e) {
      console.log(e);
    }
  },
};
