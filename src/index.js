const { loadAndSplit } = require("./pdfloader");
const { embedData } = require("./embedding");
const { pineconeIndex } = require("./pinecone");

async function vectorSearch(fileName, manufacturer, model, year, refId) {
  try {
    const sourcepath = `./data/${fileName}`;
    const chunks = await loadAndSplit(sourcepath);
    const indexVactor = await pineconeIndex();

    for (let index = 0; index < chunks.length; index++) {
      const chunk = chunks[index];
      const vectorData = await embedData(chunk);

      const metadata = {
        chunk: chunk,
        manufacturer: manufacturer,
        model: model,
        year: year,
        refId: refId,
      };

      console.log("Embedding Result:", vectorData);

      await indexVactor.upsert([
        {
          id: Date.now().toString(),
          values: vectorData,
          metadata,
        },
      ]);
    }
  } catch (error) {
    console.log(error);
  }
}

const fileName = "Pad - Lifting - Each (Remove and Replace).pdf";
const manufacturer = "Tesla";
const model = "Model X";
const year = 2020;
const refId = Date.now();

vectorSearch(fileName, manufacturer, model, year, refId).catch((err) =>
  console.error("Error :", err)
);
