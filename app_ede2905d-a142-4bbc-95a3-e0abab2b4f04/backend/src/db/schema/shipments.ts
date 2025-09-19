import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';

export const shipments = pgTable('shipments', {
  id: uuid('id').primaryKey().defaultRandom(),
  urgency: varchar('urgency', { length: 32 }).notNull(),
  pickupTime: timestamp('pickup_time').notNull(),
  deliveryTime: timestamp('delivery_time').notNull(),
  status: varchar('status', { length: 32 }).notNull(),
  eta: varchar('eta', { length: 32 }),
  mapPreview: text('map_preview'),
  details: text('details'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const shipmentHistory = pgTable('shipment_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  shipmentId: uuid('shipment_id')
    .notNull()
    .references(() => shipments.id),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  status: varchar('status', { length: 32 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Shipment = typeof shipments.$inferSelect;
export type NewShipment = typeof shipments.$inferInsert;
export type ShipmentHistory = typeof shipmentHistory.$inferSelect;
export type NewShipmentHistory = typeof shipmentHistory.$inferInsert;
