import { Badge } from '@/shared/ui';
import { cn } from '@/shared/lib/utils';

interface ShipmentStatusBadgeProps {
  status?: string;
  className?: string;
}

const getStatusVariant = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'secondary';
    case 'in-transit':
      return 'default';
    case 'delivered':
      return 'default';
    case 'exception':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'in-transit':
      return 'text-blue-600 bg-blue-100';
    case 'delivered':
      return 'text-green-600 bg-green-100';
    case 'exception':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const ShipmentStatusBadge = ({
  status,
  className,
}: ShipmentStatusBadgeProps) => {
  if (!status) return null;

  return (
    <Badge
      variant={getStatusVariant(status)}
      className={cn('font-medium', getStatusColor(status), className)}
    >
      {status.replace('-', ' ').toUpperCase()}
    </Badge>
  );
};
