import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import path from 'path';
import * as schema from './schema/index';

// In production on Render, DATABASE_URL points to the persistent disk mount.
// In local dev it falls back to sqlite.db next to the compiled output.
const DB_PATH = process.env.DATABASE_URL || path.resolve(__dirname, '..', '..', 'sqlite.db');

const sqlite = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });
export { sqlite };
