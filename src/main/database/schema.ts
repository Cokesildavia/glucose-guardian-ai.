import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const timestamp = (name: string) => text(name).notNull().default(sql`CURRENT_TIMESTAMP`);

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  phone: text('phone').notNull().default(''),
  email: text('email').notNull().default(''),
  notes: text('notes').notNull().default(''),
  createdAt: timestamp('created_at'),
});

export const devices = sqliteTable('devices', {
  id: text('id').primaryKey(),
  customerId: text('customer_id')
    .notNull()
    .references(() => customers.id, { onDelete: 'cascade' }),
  category: text('category').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  serialNumber: text('serial_number').notNull().default(''),
  createdAt: timestamp('created_at'),
});

export const repairs = sqliteTable('repairs', {
  id: text('id').primaryKey(),
  deviceId: text('device_id')
    .notNull()
    .references(() => devices.id, { onDelete: 'cascade' }),
  issue: text('issue').notNull(),
  diagnosis: text('diagnosis').notNull().default(''),
  repairNotes: text('repair_notes').notNull().default(''),
  status: text('status', {
    enum: ['received', 'diagnosing', 'awaiting_parts', 'in_progress', 'ready', 'delivered'],
  })
    .notNull()
    .default('received'),
  estimatedCostCents: integer('estimated_cost_cents'),
  finalCostCents: integer('final_cost_cents'),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
});

export const repairHistory = sqliteTable('repair_history', {
  id: text('id').primaryKey(),
  repairId: text('repair_id')
    .notNull()
    .references(() => repairs.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  note: text('note').notNull().default(''),
  changedAt: timestamp('changed_at'),
});

export const repairPhotos = sqliteTable('repair_photos', {
  id: text('id').primaryKey(),
  repairId: text('repair_id')
    .notNull()
    .references(() => repairs.id, { onDelete: 'cascade' }),
  relativePath: text('relative_path').notNull(),
  caption: text('caption').notNull().default(''),
  createdAt: timestamp('created_at'),
});
