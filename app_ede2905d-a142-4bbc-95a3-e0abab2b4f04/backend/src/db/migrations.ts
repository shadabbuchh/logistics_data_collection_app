import { join } from 'path';
import type { FastifyInstance } from 'fastify';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

// Run Drizzle migrations using the same folder as configured in drizzle.config.ts
export async function runMigrations(fastifyApp: FastifyInstance) {
  if (!fastifyApp?.config?.APP_DATABASE_URL) {
    throw new Error(
      'APP_DATABASE_URL not found in Fastify app.config. Ensure @fastify/env plugin is properly registered.'
    );
  }

  // Create a temporary connection for migrations (separate from app's main DB connection)
  const pool = new pg.Pool({
    connectionString: fastifyApp.config.APP_DATABASE_URL,
  });
  const db = drizzle(pool);

  try {
    // Use the same output directory as drizzle.config.ts: './src/db/migrations'
    const migrationsFolder = join(process.cwd(), 'src', 'db', 'migrations');
    await migrate(db, { migrationsFolder });
  } finally {
    await pool.end();
  }
}
