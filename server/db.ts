import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL must be set.');
}

export const pool = new Pool({ connectionString });
export const db = drizzle(pool);

// Optional connection test
(async () => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Database connected at', rows[0]);
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})();
