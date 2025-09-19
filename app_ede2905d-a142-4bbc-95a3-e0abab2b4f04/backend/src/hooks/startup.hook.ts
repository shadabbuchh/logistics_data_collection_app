import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';
import { runMigrations } from '../db/migrations';
import { log } from '../utils/logger';

// Startup hook that runs database migrations and seeds before the server starts
// Fails startup if migration fails, but allows startup to continue if seeds fail
export default fp(async (app: FastifyInstance) => {
  app.addHook('onReady', async () => {
    // Run migrations first - these are critical and will fail startup if they fail
    try {
      log.info('Running database migrations on startup (Drizzle)...');
      await runMigrations(app);
      log.info('Database migrations completed successfully');
    } catch (error: unknown) {
      const errorToLog =
        error instanceof Error ? error : new Error(String(error));
      log.error({ err: errorToLog }, 'Failed to run database migrations');
      log.error('Failing startup due to database migration error');
      process.exit(1);
    }

    log.info('✅ Database setup completed successfully');
  });
});
