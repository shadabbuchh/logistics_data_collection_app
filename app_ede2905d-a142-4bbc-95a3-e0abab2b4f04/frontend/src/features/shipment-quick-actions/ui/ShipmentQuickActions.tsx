import { Button } from '@/shared/ui';
import { Navigation, CheckCircle, AlertTriangle } from 'lucide-react';
import { useUpdateShipmentStatus } from '../api/mutations';

interface ShipmentQuickActionsProps {
  shipmentId?: string;
}

export const ShipmentQuickActions = ({
  shipmentId,
}: ShipmentQuickActionsProps) => {
  const updateShipmentMutation = useUpdateShipmentStatus();

  const handleStartRoute = () => {
    if (!shipmentId) return;
    // TODO: Implement navigation/routing functionality
    console.log('Starting route for shipment:', shipmentId);
  };

  const handleMarkDelivered = () => {
    if (!shipmentId) return;
    updateShipmentMutation.mutate({
      shipmentId,
      data: {
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
      },
    });
  };

  const handleReportIssue = () => {
    if (!shipmentId) return;
    updateShipmentMutation.mutate({
      shipmentId,
      data: {
        status: 'exception',
      },
    });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleStartRoute}
        className="gap-2"
      >
        <Navigation className="h-4 w-4" />
        Route
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleMarkDelivered}
        className="gap-2 text-green-600 hover:text-green-700"
        disabled={updateShipmentMutation.isPending}
      >
        <CheckCircle className="h-4 w-4" />
        Delivered
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleReportIssue}
        className="gap-2 text-orange-600 hover:text-orange-700"
        disabled={updateShipmentMutation.isPending}
      >
        <AlertTriangle className="h-4 w-4" />
        Issue
      </Button>
    </div>
  );
};
