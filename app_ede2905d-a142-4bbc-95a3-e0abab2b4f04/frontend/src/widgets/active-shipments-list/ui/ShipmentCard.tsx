import { useNavigate } from 'react-router-dom';
import { Badge, Button } from '@/shared/ui';
import { ShipmentQuickActions } from '@/features/shipment-quick-actions';
import { ShipmentStatusBadge } from '@/features/shipment-status-badge';
import type { components } from '@app/shared/generated-types';

type Shipment = components['schemas']['Shipment'];

interface ShipmentCardProps {
  shipment: Shipment;
}

export const ShipmentCard = ({ shipment }: ShipmentCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/shipments/${shipment.id}`);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleCardClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <h3 className="font-medium text-sm">#{shipment.id?.slice(-8)}</h3>
          <ShipmentStatusBadge status={shipment.status} />
          {shipment.urgency && (
            <Badge
              variant={
                shipment.urgency === 'high' ? 'destructive' : 'secondary'
              }
            >
              {shipment.urgency}
            </Badge>
          )}
        </div>
        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
          <ShipmentQuickActions shipmentId={shipment.id} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <span className="text-muted-foreground">Pickup:</span>
          <div>
            {formatDate(shipment.pickupTime)} at{' '}
            {formatTime(shipment.pickupTime)}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Delivery:</span>
          <div>
            {formatDate(shipment.deliveryTime)} at{' '}
            {formatTime(shipment.deliveryTime)}
          </div>
        </div>
      </div>

      {shipment.eta && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">ETA: {shipment.eta}</span>
          {shipment.mapPreview && (
            <Button variant="outline" size="sm">
              View Map
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
