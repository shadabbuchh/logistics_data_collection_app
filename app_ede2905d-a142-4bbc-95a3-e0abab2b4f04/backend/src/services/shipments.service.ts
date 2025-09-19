import type { FastifyInstance } from 'fastify';
import type { components } from '../../../shared/generated-types';

type Shipment = components['schemas']['Shipment'];
type ShipmentDetail = components['schemas']['ShipmentDetail'];
type UpdateShipmentStatusRequest =
  components['schemas']['UpdateShipmentStatusRequest'];

export const makeShipmentsService = (app: FastifyInstance) => ({
  async listActiveShipments(
    filters: {
      status?: string;
      timeWindow?: string;
      priority?: string;
      search?: string;
    } = {}
  ): Promise<Shipment[]> {
    app.log.info({ filters }, 'Fetching active shipments with filters');

    const shipments = await app.repositories.shipments.findAll(filters);

    // Map database schema to API response format
    return shipments.map(shipment => ({
      id: shipment.id,
      urgency: shipment.urgency,
      pickupTime: shipment.pickupTime?.toISOString(),
      deliveryTime: shipment.deliveryTime?.toISOString(),
      status: shipment.status,
      eta: shipment.eta || undefined,
      mapPreview: shipment.mapPreview || undefined,
      createdAt: shipment.createdAt?.toISOString(),
      updatedAt: shipment.updatedAt?.toISOString(),
    }));
  },

  async getShipmentDetails(id: string): Promise<ShipmentDetail | null> {
    app.log.info({ shipmentId: id }, 'Fetching shipment details');

    const shipmentWithHistory =
      await app.repositories.shipments.findByIdWithHistory(id);

    if (!shipmentWithHistory) {
      return null;
    }

    const { history, ...shipment } = shipmentWithHistory;

    return {
      id: shipment.id,
      details: shipment.details || '',
      status: shipment.status,
      history: history.map(h => ({
        timestamp: h.timestamp?.toISOString(),
        status: h.status,
      })),
      createdAt: shipment.createdAt?.toISOString(),
      updatedAt: shipment.updatedAt?.toISOString(),
    };
  },

  async updateShipmentStatus(
    id: string,
    updateRequest: UpdateShipmentStatusRequest
  ): Promise<Shipment | null> {
    app.log.info({ shipmentId: id, updateRequest }, 'Updating shipment status');

    // Validate that shipment exists
    const existingShipment = await app.repositories.shipments.findById(id);
    if (!existingShipment) {
      return null;
    }

    // Update the shipment status
    const deliveredAt = updateRequest.deliveredAt
      ? new Date(updateRequest.deliveredAt)
      : undefined;
    const updatedShipment = await app.repositories.shipments.updateStatus(
      id,
      updateRequest.status || existingShipment.status,
      deliveredAt
    );

    if (!updatedShipment) {
      return null;
    }

    // Map back to API response format
    return {
      id: updatedShipment.id,
      urgency: updatedShipment.urgency,
      pickupTime: updatedShipment.pickupTime?.toISOString(),
      deliveryTime: updatedShipment.deliveryTime?.toISOString(),
      status: updatedShipment.status,
      eta: updatedShipment.eta || undefined,
      mapPreview: updatedShipment.mapPreview || undefined,
      createdAt: updatedShipment.createdAt?.toISOString(),
      updatedAt: updatedShipment.updatedAt?.toISOString(),
    };
  },

  // Business logic for quick actions
  async startRoute(shipmentId: string): Promise<Shipment | null> {
    app.log.info({ shipmentId }, 'Starting route for shipment');

    return this.updateShipmentStatus(shipmentId, { status: 'in_transit' });
  },

  async markDelivered(
    shipmentId: string,
    signature?: string,
    condition?: string
  ): Promise<Shipment | null> {
    app.log.info(
      { shipmentId, signature, condition },
      'Marking shipment as delivered'
    );

    return this.updateShipmentStatus(shipmentId, {
      status: 'delivered',
      deliveredAt: new Date().toISOString(),
      signature,
      condition,
    });
  },

  async reportIssue(
    shipmentId: string,
    issue: string
  ): Promise<Shipment | null> {
    app.log.info({ shipmentId, issue }, 'Reporting issue for shipment');

    return this.updateShipmentStatus(shipmentId, { status: 'exception' });
  },
});
