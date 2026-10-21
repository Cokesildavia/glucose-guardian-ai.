import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { app } from 'electron';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from './schema';

export function openDatabase() {
  const userDataPath = app.getPath('userData');
  mkdirSync(join(userDataPath, 'photos'), { recursive: true });
  const sqlite = new Database(join(userDataPath, 'taller-repair.sqlite'));
  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');

  const database = drizzle(sqlite, { schema });
  const migrationsFolder = app.isPackaged
    ? join(process.resourcesPath, 'drizzle')
    : join(app.getAppPath(), 'drizzle');

  migrate(database, { migrationsFolder });
  return { database, close: () => sqlite.close() };
}
