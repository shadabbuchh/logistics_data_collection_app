import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Services } from '../services/index';
import type { components } from '../../../shared/generated-types';

type ErrorResponse = components['schemas']['ErrorResponse'];

/**
 * OpenAPI operation handlers for fastify-openapi-glue
 *
 * Maps OpenAPI operationIds to service method calls.
 * Extend this class to add handlers for new entities.
 */
export class OpenAPIServiceHandlers {
  protected services: Services;

  constructor(services: Services) {
    this.services = services;
  }

  // Shipment operations matching OpenAPI operationIds

  async listActiveShipments(request: FastifyRequest) {
    const { status, timeWindow, priority, search } = request.query as {
      status?: string;
      timeWindow?: string;
      priority?: string;
      search?: string;
    };

    try {
      const shipments = await this.services.shipments.listActiveShipments({
        status,
        timeWindow,
        priority,
        search,
      });

      return shipments;
    } catch (error) {
      request.log.error({ error }, 'Failed to list active shipments');
      const errorResponse: ErrorResponse = {
        message: 'Failed to fetch shipments',
        code: 500,
      };
      return errorResponse;
    }
  }

  async getShipmentDetails(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    try {
      const shipmentDetails =
        await this.services.shipments.getShipmentDetails(id);

      if (!shipmentDetails) {
        const errorResponse: ErrorResponse = {
          message: 'Shipment not found',
          code: 404,
        };
        reply.status(404);
        return errorResponse;
      }

      return shipmentDetails;
    } catch (error) {
      request.log.error(
        { error, shipmentId: id },
        'Failed to get shipment details'
      );
      const errorResponse: ErrorResponse = {
        message: 'Failed to fetch shipment details',
        code: 500,
      };
      reply.status(500);
      return errorResponse;
    }
  }

  async updateShipmentStatus(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const updateRequest =
      request.body as components['schemas']['UpdateShipmentStatusRequest'];

    try {
      const updatedShipment =
        await this.services.shipments.updateShipmentStatus(id, updateRequest);

      if (!updatedShipment) {
        const errorResponse: ErrorResponse = {
          message: 'Shipment not found',
          code: 404,
        };
        reply.status(404);
        return errorResponse;
      }

      return updatedShipment;
    } catch (error) {
      request.log.error(
        { error, shipmentId: id, updateRequest },
        'Failed to update shipment status'
      );
      const errorResponse: ErrorResponse = {
        message: 'Failed to update shipment status',
        code: 500,
      };
      reply.status(500);
      return errorResponse;
    }
  }

  // Add operation handlers here that match OpenAPI operationIds
  //
  // Example:
  // async getDashboardMetrics(request: FastifyRequest) {
  //   const users = await this.services.user.list();
  //   return { data: users };
  // }
}
