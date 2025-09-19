import { useShipmentsQuery } from '@/entities/shipment';
import { ShipmentFilters } from '@/features/shipment-filters';
import { ShipmentCard } from './ShipmentCard';
import { Skeleton } from '@/shared/ui';

export const ActiveShipmentsList = () => {
  const { data: shipments, isLoading, error } = useShipmentsQuery();

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading shipments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ShipmentFilters />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {shipments?.map(shipment => (
            <ShipmentCard key={shipment.id} shipment={shipment} />
          ))}
        </div>
      )}
    </div>
  );
};
