import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// TODO: Only connect to the DB over HTTPS if we're not in development

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // Check the cache
  if (cachedClient && cachedDb) {
    // Load from cache
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Connect to cluster
  let client = new MongoClient(uri, options);
  await client.connect();
  let db = client.db(dbName);

  // Set cache
  cachedClient = client;
  cachedDb = db;

  return {
    client: cachedClient,
    db: cachedDb,
  };
}