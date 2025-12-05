import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from '@shared/schema';

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

// Initialize Drizzle ORM
export const db = drizzle({
  client: pool,
  schema,
});

// Optional: Test connection at startup
(async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected:', result.rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();
