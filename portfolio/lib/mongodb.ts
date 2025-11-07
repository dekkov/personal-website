import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Initialize connection only if URI is available
if (uri) {
  // Always use global caching to prevent connection pool exhaustion
  // This works for both development and production (including serverless)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  console.error('❌ MONGODB_URI environment variable is not set');
}

export default clientPromise;

// Helper to get the database instance
export async function getDatabase(): Promise<Db> {
  if (!clientPromise) {
    throw new Error(
      'MongoDB connection not initialized. Please set MONGODB_URI and MONGODB_DB_NAME environment variables in your deployment platform (e.g., Vercel Dashboard > Settings > Environment Variables)'
    );
  }
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB_NAME || 'portfolio');
}

// Collection names
export const COLLECTIONS = {
  TRENDS: 'trends',
  TRENDS_ARCHIVE: 'trends_archive',
} as const;
