const { embedData, chatModel } = require("./embedding");
const { pineconeIndex } = require("./pinecone");

async function chat(query, manufacturer, model, year) {
  try {
    const queryVector = await embedData(query);

    const indexVactor = await pineconeIndex();

    const queryResponse = await indexVactor.query({
      vector: queryVector,
      topK: 1,
      includeMetadata: true,
      filter: {
        $and: [
          { manufacturer: { $eq: manufacturer } },
          { model: { $eq: model } },
          { year: { $eq: year } },
        ],
      },
    });

    if (queryResponse.matches && queryResponse.matches.length > 0) {
      const result = queryResponse.matches[0];
      const chunk = result.metadata.chunk;

      // console.log("Most relevant result found ====>", chunk);

      const llm = await chatModel();
      const prompt = chunk
        ? `Answer the following question based on the information: "${chunk}"\nQuestion: ${query}`
        : query;
      const completion = await llm.invoke([
        {
          role: "system",
          content:
            "You are a helpful assistant that help people to find latest information.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);
      console.log("completion ==>", completion.content);
    }
  } catch (error) {
    console.log("Error during chat:", error);
    return { answer: "An error occurred while processing the request." };
  }
}

// const query = "Where can one send feedback on FRT values?";
const query = "How to replace Wheels Set";
const manufacturer = "Tesla";
const model = "Model X";
const year = 2020;
chat(query, manufacturer, model, year).catch((err) =>
  console.error("Error :", err)
);
