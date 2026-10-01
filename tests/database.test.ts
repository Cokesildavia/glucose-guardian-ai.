import { join } from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createRepair, getDashboardSummary } from '../src/main/database/repairs';
import * as schema from '../src/main/database/schema';

describe('repair database operations', () => {
  let sqlite: Database.Database;
  let database: ReturnType<typeof drizzle<typeof schema>>;

  beforeEach(() => {
    sqlite = new Database(':memory:');
    sqlite.pragma('foreign_keys = ON');
    database = drizzle(sqlite, { schema });
    migrate(database, { migrationsFolder: join(process.cwd(), 'drizzle') });
  });

  afterEach(() => {
    sqlite.close();
  });

  it('records a repair and includes it in the dashboard summary', () => {
    const repair = createRepair(database, {
      customerName: 'Ana García',
      customerPhone: '600123456',
      deviceCategory: 'smartphone',
      deviceBrand: 'Apple',
      deviceModel: 'iPhone 13',
      issue: 'No enciende',
    });

    expect(repair.status).toBe('received');
    expect(repair.deviceLabel).toBe('Apple iPhone 13');
    expect(getDashboardSummary(database)).toEqual({
      stats: {
        totalRepairs: 1,
        inProgress: 0,
        awaitingParts: 0,
        readyForPickup: 0,
      },
      recentRepairs: [repair],
    });
  });

  it('stores the complete repair history and distinct timestamp columns', () => {
    createRepair(database, {
      customerName: 'Ana García',
      customerPhone: '',
      deviceCategory: 'tablet',
      deviceBrand: 'Samsung',
      deviceModel: 'Tab S9',
      issue: 'Pantalla rota',
    });

    const historyColumns = sqlite.pragma('table_info(repair_history)') as { name: string }[];
    const repairColumns = sqlite.pragma('table_info(repairs)') as { name: string }[];
    const historyRows = sqlite.prepare('SELECT status, changed_at FROM repair_history').all() as {
      status: string;
      changed_at: string;
    }[];

    expect(historyColumns.some(({ name }) => name === 'changed_at')).toBe(true);
    expect(repairColumns.some(({ name }) => name === 'updated_at')).toBe(true);
    expect(historyRows).toHaveLength(1);
    expect(historyRows[0]?.status).toBe('received');
    expect(historyRows[0]?.changed_at).not.toBe('');
  });

  it('reuses a customer record for repeat repair visits', () => {
    const intake = {
      customerName: 'Ana García',
      customerPhone: '600123456',
      deviceCategory: 'smartphone' as const,
      deviceBrand: 'Apple',
      deviceModel: 'iPhone 13',
      issue: 'No enciende',
    };

    createRepair(database, intake);
    createRepair(database, { ...intake, issue: 'No carga' });

    const customerCount = sqlite.prepare('SELECT COUNT(*) AS total FROM customers').get() as {
      total: number;
    };
    const summary = getDashboardSummary(database);

    expect(customerCount.total).toBe(1);
    expect(summary.stats.totalRepairs).toBe(2);
  });
});
