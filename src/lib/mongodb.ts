import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI || "";
console.log('MongoDB URI loaded:', !!uri);

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    try {
      await cachedClient.db().command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch {
      // Reset cache if connection is dead
      cachedClient = null;
      cachedDb = null;
    }
  }

  if (!uri) {
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 2500,
    connectTimeoutMS: 2500,
  });

  await client.connect();
  const dbName = process.env.MONGODB_DB || "dbuu_hub";
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
