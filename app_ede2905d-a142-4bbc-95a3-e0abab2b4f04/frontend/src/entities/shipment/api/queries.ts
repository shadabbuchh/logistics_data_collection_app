import { useQuery } from '@tanstack/react-query';
import { get, handleError } from '@/shared/api';
import { useShipmentFiltersStore } from '@/features/shipment-filters/model/store';

export const useShipmentsQuery = () => {
  const filters = useShipmentFiltersStore(state => state.filters);

  return useQuery({
    queryKey: ['shipments', filters],
    queryFn: async () => {
      const { data, error } = await get('/shipments', {
        params: {
          query: {
            status: filters.status || undefined,
            timeWindow: filters.timeWindow || undefined,
            priority: filters.priority || undefined,
            search: filters.search || undefined,
          },
        },
      });

      if (error) handleError(error);

      return data;
    },
  });
};

export const useShipmentDetailsQuery = (shipmentId: string) => {
  return useQuery({
    queryKey: ['shipments', shipmentId],
    queryFn: async () => {
      const { data, error } = await get('/shipments/{id}', {
        params: {
          path: { id: shipmentId },
        },
      });

      if (error) handleError(error);

      return data;
    },
    enabled: !!shipmentId,
  });
};
