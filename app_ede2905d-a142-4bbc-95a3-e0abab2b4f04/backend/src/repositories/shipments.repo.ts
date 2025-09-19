import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { eq, and, desc, ilike, or } from 'drizzle-orm';
import type * as schema from '../db/schema';
import {
  shipments,
  shipmentHistory,
  type Shipment,
  type NewShipment,
  type ShipmentHistory,
  type NewShipmentHistory,
} from '../db/schema';

export const shipmentsRepo = (db: NodePgDatabase<typeof schema>) => ({
  // List all shipments with filters and search
  async findAll(
    filters: {
      status?: string;
      timeWindow?: string;
      priority?: string;
      search?: string;
    } = {}
  ): Promise<Shipment[]> {
    const conditions = [];

    if (filters.status) {
      conditions.push(eq(shipments.status, filters.status));
    }

    if (filters.priority) {
      conditions.push(eq(shipments.urgency, filters.priority));
    }

    if (filters.search) {
      conditions.push(
        or(
          ilike(shipments.details, `%${filters.search}%`),
          ilike(shipments.status, `%${filters.search}%`),
          ilike(shipments.urgency, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      return await db
        .select()
        .from(shipments)
        .where(and(...conditions))
        .orderBy(desc(shipments.urgency), desc(shipments.pickupTime));
    }

    return await db
      .select()
      .from(shipments)
      .orderBy(desc(shipments.urgency), desc(shipments.pickupTime));
  },

  // Find shipment by ID
  async findById(id: string): Promise<Shipment | undefined> {
    const result = await db
      .select()
      .from(shipments)
      .where(eq(shipments.id, id))
      .limit(1);
    return result[0];
  },

  // Find shipment details with history
  async findByIdWithHistory(id: string) {
    const shipment = await this.findById(id);
    if (!shipment) return undefined;

    const history = await db
      .select()
      .from(shipmentHistory)
      .where(eq(shipmentHistory.shipmentId, id))
      .orderBy(desc(shipmentHistory.timestamp));

    return {
      ...shipment,
      history,
    };
  },

  // Create new shipment
  async create(shipmentData: NewShipment): Promise<Shipment> {
    const result = await db.insert(shipments).values(shipmentData).returning();
    return result[0];
  },

  // Update shipment status
  async updateStatus(
    id: string,
    status: string,
    deliveredAt?: Date
  ): Promise<Shipment | undefined> {
    const updateData: Partial<NewShipment> = {
      status,
      updatedAt: new Date(),
    };

    const result = await db
      .update(shipments)
      .set(updateData)
      .where(eq(shipments.id, id))
      .returning();

    if (result[0]) {
      // Add history record
      await this.addHistoryRecord({
        shipmentId: id,
        status,
        timestamp: deliveredAt || new Date(),
      });
    }

    return result[0];
  },

  // Add history record
  async addHistoryRecord(
    historyData: NewShipmentHistory
  ): Promise<ShipmentHistory> {
    const result = await db
      .insert(shipmentHistory)
      .values(historyData)
      .returning();
    return result[0];
  },

  // Delete shipment (if needed)
  async delete(id: string): Promise<boolean> {
    // First delete history records
    await db.delete(shipmentHistory).where(eq(shipmentHistory.shipmentId, id));

    // Then delete shipment
    const result = await db.delete(shipments).where(eq(shipments.id, id));
    return (result.rowCount ?? 0) > 0;
  },
});