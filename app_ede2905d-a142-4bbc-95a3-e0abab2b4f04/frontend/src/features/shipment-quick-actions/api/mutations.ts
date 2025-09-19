import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post, handleError } from '@/shared/api';
import type { components } from '@app/shared/generated-types';

type UpdateShipmentStatusRequest =
  components['schemas']['UpdateShipmentStatusRequest'];

interface UpdateShipmentStatusParams {
  shipmentId: string;
  data: UpdateShipmentStatusRequest;
}

export const useUpdateShipmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ shipmentId, data }: UpdateShipmentStatusParams) => {
      const { data: response, error } = await post('/shipments/{id}', {
        params: {
          path: { id: shipmentId },
        },
        body: data,
      });

      if (error) handleError(error);

      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch shipments list
      queryClient.invalidateQueries({ queryKey: ['shipments'] });
    },
  });
};
