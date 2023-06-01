import { MongoClient } from "mongodb";

const MONGODB_URL = process.env.NEXT_PUBLIC_MONGODB_URL;
const MONGODB_DB = process.env.NEXT_PUBLIC_DB_NAME;

// let cachedClient: MongoClient | null = null;
// let cachedDb: Db | null = null;

// export async function mongoDBConnector(): Promise<{
//   client: MongoClient | null;
//   db: Db | null;
// }> {
//   // check the cached.
//   if (cachedClient || cachedDb) {
//     // load from cache
//     console.log("Already connected to db");
//     return {
//       client: cachedClient,
//       db: cachedDb,
//     };
//   }

//   // Connect to db
//   let client = new MongoClient(MONGODB_URL as string);
//   await client.connect();
//   let db = client.db(MONGODB_DB);

//   // set cache
//   cachedClient = client;
//   cachedDb = db;

//   console.log("connected");
//   return {
//     client: cachedClient,
//     db: cachedDb,
//   };
// }

if (!MONGODB_DB) {
  throw new Error("Define the MONGODB_DB environmental variable");
}

if (!MONGODB_URL) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;
export let mongoDBConnector: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).

  let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };

  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(MONGODB_URL);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }

  mongoDBConnector = globalWithMongoClientPromise._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URL);
  mongoDBConnector = client.connect();
}

