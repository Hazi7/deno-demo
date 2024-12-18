
//#nbts@code
import { load } from "jsr:@std/dotenv";

//#nbts@code
await load({ export: true });

//#nbts@code
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";

//#nbts@code
const exampleCsvPath = "./data/train.csv";
const loader = new CSVLoader(exampleCsvPath);
const data = await loader.load();

//#nbts@code
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

//#nbts@code
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});
const docs = await textSplitter.splitDocuments(data);

//#nbts@code
import { MongoClient } from "mongodb";

//#nbts@code
const client = new MongoClient(Deno.env.get("MONGODB_ATLAS_URI") || "");

const collection = client
  .db(Deno.env.get("MONGODB_ATLAS_DB_NAME"))
  .collection(Deno.env.get("MONGODB_ATLAS_COLLECTION_NAME") || "");

//#nbts@code
// import { OpenAIEmbeddings } from "@langchain/openai";

//#nbts@code
// const embeddingsModel = new OpenAIEmbeddings(
//   {
//     model: "netease-youdao/bce-embedding-base_v1",
//   },
//   {
//     baseURL: Deno.env.get("OPENAI_BASE_URL"),
//   }
// );

//#nbts@code
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

//#nbts@code
const embeddingsModel = new GoogleGenerativeAIEmbeddings({
  modelName: "embedding-001", // 768 dimensions
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  title: "Document title",
  apiKey: "",
});

//#nbts@code
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

//#nbts@code
await MongoDBAtlasVectorSearch.fromDocuments(docs, embeddingsModel, {
  collection,
  indexName: "vector_index", // The name of the Atlas search index to use.
  textKey: "text", // Field name for the raw text content. Defaults to "text".
  embeddingKey: "embedding", // Field name for the vector embeddings. Defaults to "embedding".
});

//#nbts@code
