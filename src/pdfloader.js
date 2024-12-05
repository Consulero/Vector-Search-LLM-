const fs = require("fs");
const pdfParse = require("pdf-parse");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

module.exports = {
  async loadAndSplit(sourcepath) {
    try {
      const pdfBuffer = fs.readFileSync(sourcepath);
      const pdfData = await pdfParse(pdfBuffer);
      const text = pdfData.text;

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      const chunks = await splitter.splitText(text);

      return chunks;
    } catch (e) {
      console.error(e);
    }
  },
};
