const { loadAndSplit } = require("./pdfloader");
const { embedData } = require("./embedding");

async function vectorSearch() {
  try {
    const sourcepath = "./data/Remove Stuck Deadfront - Charge Handle.pdf";
    const chunks = await loadAndSplit(sourcepath);
    for (let index = 0; index < chunks.length; index++) {
      // const chunk = chunks[index];
      // console.log(`${index + 1} Chunch: ==>`, chunk);
      // const result = await embedData(chunk);
      const embedData = [
        0.1256789, -0.4321234, 0.2998412, -0.789234, 0.1234321, -0.9894321,
        0.2345678, -0.5431234, 0.0983121, 0.1324567, 0.7778111, -0.2223334,
        0.3454321, 0.5648723, -0.2345123, 0.9123123, -0.3423344, 0.0012345,
        0.9876543, -0.3421234, 0.1232345, -0.7778111, 0.9887654, 0.2345567,
        -0.5679123,
      ];
      console.log("Embedding Result:", embedData);
    }
  } catch (error) {
    console.log(error);
  }
}

vectorSearch().catch((err) => console.error("Error :", err));
