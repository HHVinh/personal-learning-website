import { Database } from '@cloudflare/d1';

declare global {
  var DB: Database | undefined;
}

// Global variable to hold the database instance
let db: Database | null = null;

/**
 * Initialize the database connection.
 * Call this once at application startup with the D1 binding from the environment.
 *
 * In Cloudflare Pages/Workers: The D1 binding is available as `env.DB`
 * In API routes: you can call initializeDb(env.DB)
 */
export function initializeDb(database: Database) {
  db = database;
}

/**
 * Get the database instance.
 * Throws if not initialized.
 */
export function getDb(): Database {
  if (!db) {
    // Fallback for Cloudflare runtime where DB binding is auto-injected
    const runtimeDb = globalThis.DB as Database | undefined;
    if (runtimeDb) {
      db = runtimeDb;
    } else {
      throw new Error('Database not initialized. Call initializeDb() first with the D1 binding from env.DB');
    }
  }
  return db;
}
