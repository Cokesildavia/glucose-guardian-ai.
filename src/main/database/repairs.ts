import { randomUUID } from 'node:crypto';
import { count, desc, inArray, sql } from 'drizzle-orm';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import type { CreateRepairInput } from '../../shared/validation';
import type { DashboardSummary, RepairSummary } from '../../shared/contracts';
import * as schema from './schema';

type Database = BetterSQLite3Database<typeof schema>;

export function getDashboardSummary(database: Database): DashboardSummary {
  const [total] = database.select({ value: count() }).from(schema.repairs).all();
  const [inProgress] = database
    .select({ value: count() })
    .from(schema.repairs)
    .where(inArray(schema.repairs.status, ['diagnosing', 'in_progress']))
    .all();
  const [awaitingParts] = database
    .select({ value: count() })
    .from(schema.repairs)
    .where(inArray(schema.repairs.status, ['awaiting_parts']))
    .all();
  const [readyForPickup] = database
    .select({ value: count() })
    .from(schema.repairs)
    .where(inArray(schema.repairs.status, ['ready']))
    .all();

  const recentRepairs = database
    .select({
      id: schema.repairs.id,
      customerName: schema.customers.name,
      deviceLabel: sql<string>`${schema.devices.brand} || ' ' || ${schema.devices.model}`,
      issue: schema.repairs.issue,
      status: schema.repairs.status,
      receivedAt: schema.repairs.createdAt,
    })
    .from(schema.repairs)
    .innerJoin(schema.devices, sql`${schema.repairs.deviceId} = ${schema.devices.id}`)
    .innerJoin(schema.customers, sql`${schema.devices.customerId} = ${schema.customers.id}`)
    .orderBy(desc(schema.repairs.createdAt))
    .limit(8)
    .all() as RepairSummary[];

  return {
    stats: {
      totalRepairs: total.value,
      inProgress: inProgress.value,
      awaitingParts: awaitingParts.value,
      readyForPickup: readyForPickup.value,
    },
    recentRepairs,
  };
}

export function createRepair(database: Database, input: CreateRepairInput): RepairSummary {
  const repairId = randomUUID();
  const customerId = randomUUID();
  const deviceId = randomUUID();
  const receivedAt = new Date().toISOString();

  database.transaction((transaction) => {
    transaction
      .insert(schema.customers)
      .values({ id: customerId, name: input.customerName, phone: input.customerPhone })
      .run();
    transaction
      .insert(schema.devices)
      .values({
        id: deviceId,
        customerId,
        category: input.deviceCategory,
        brand: input.deviceBrand,
        model: input.deviceModel,
      })
      .run();
    transaction
      .insert(schema.repairs)
      .values({ id: repairId, deviceId, issue: input.issue, createdAt: receivedAt, updatedAt: receivedAt })
      .run();
    transaction
      .insert(schema.repairHistory)
      .values({ id: randomUUID(), repairId, status: 'received', note: 'Equipo recibido', changedAt: receivedAt })
      .run();
  }).immediate();

  return {
    id: repairId,
    customerName: input.customerName,
    deviceLabel: `${input.deviceBrand} ${input.deviceModel}`,
    issue: input.issue,
    status: 'received',
    receivedAt,
  };
}
