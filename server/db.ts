import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Required for serverless WebSocket support
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is set
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error(
    'DATABASE_URL must be set. Did you forget to provision a database?',
  );
}

// Create a connection pool
export const pool = new Pool({ connectionString });

// Initialize Drizzle ORM (without importing the schema here for bundling)
export const db = drizzle(pool);
