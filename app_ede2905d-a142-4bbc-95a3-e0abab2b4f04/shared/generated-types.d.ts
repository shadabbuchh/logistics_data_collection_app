/**
 * ⚠️  AUTO-GENERATED FILE - DO NOT MODIFY ⚠️
 *
 * This file contains TypeScript types generated from OpenAPI specifications.
 * Use these types for type-safe API development.
 */

export interface paths {
  '/shipments': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** List active shipments */
    get: operations['listActiveShipments'];
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/shipments/{id}': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    /** Get shipment details */
    get: operations['getShipmentDetails'];
    put?: never;
    /** Update shipment status */
    post: operations['updateShipmentStatus'];
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
}
export type webhooks = Record<string, never>;
export interface components {
  schemas: {
    Shipment: {
      /** Format: uuid */
      id?: string;
      urgency?: string;
      /** Format: date-time */
      pickupTime?: string;
      /** Format: date-time */
      deliveryTime?: string;
      status?: string;
      eta?: string;
      mapPreview?: string;
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    ShipmentDetail: {
      /** Format: uuid */
      id?: string;
      details?: string;
      status?: string;
      history?: {
        /** Format: date-time */
        timestamp?: string;
        status?: string;
      }[];
      /** Format: date-time */
      createdAt?: string;
      /** Format: date-time */
      updatedAt?: string;
    };
    UpdateShipmentStatusRequest: {
      status?: string;
      /** Format: date-time */
      deliveredAt?: string;
      signature?: string;
      condition?: string;
    };
    ErrorResponse: {
      message?: string;
      code?: number;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
  listActiveShipments: {
    parameters: {
      query?: {
        /** @description Filter by shipment status */
        status?: string;
        /** @description Filter by time window */
        timeWindow?: string;
        /** @description Filter by shipment priority */
        priority?: string;
        /** @description Search shipments by keyword */
        search?: string;
      };
      header?: never;
      path?: never;
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response with list of shipments */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Shipment'][];
        };
      };
      /** @description Bad request */
      400: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ErrorResponse'];
        };
      };
    };
  };
  getShipmentDetails: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description ID of the shipment */
        id: string;
      };
      cookie?: never;
    };
    requestBody?: never;
    responses: {
      /** @description Successful response with shipment details */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ShipmentDetail'];
        };
      };
      /** @description Shipment not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ErrorResponse'];
        };
      };
    };
  };
  updateShipmentStatus: {
    parameters: {
      query?: never;
      header?: never;
      path: {
        /** @description ID of the shipment */
        id: string;
      };
      cookie?: never;
    };
    requestBody: {
      content: {
        'application/json': components['schemas']['UpdateShipmentStatusRequest'];
      };
    };
    responses: {
      /** @description Successful status update */
      200: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['Shipment'];
        };
      };
      /** @description Shipment not found */
      404: {
        headers: {
          [name: string]: unknown;
        };
        content: {
          'application/json': components['schemas']['ErrorResponse'];
        };
      };
    };
  };
}
