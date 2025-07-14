import { MongoClient } from "mongodb";

// MongoDB connection URI from environment variable
let uri = process.env.MONGODB_URI;
let client;

console.log(process.env.MONGODB_URI)

// Helper function to get URI with lazy loading
function getMongoURI() {
  if (!uri) {
    uri = process.env.MONGODB_URI;
  }
  if (!uri) {
    throw new Error("Please add your MongoDB URI to .env.local");
  }
  return uri;
}

// Singleton pattern to prevent multiple connections
function getClientPromise() {
  if (!global._mongoClientPromise) {
    client = new MongoClient(getMongoURI());
    global._mongoClientPromise = client.connect();
  }
  return global._mongoClientPromise;
}

export default getClientPromise;

// Helper function to connect to database
export async function connectToDatabase() {
  const client = await getClientPromise();
  const db = client.db(process.env.MONGODB_DB || 'linkpilot');
  return { client, db };
} 