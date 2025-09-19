import { Helmet } from 'react-helmet-async';
import { ActiveShipmentsList } from '@/widgets/active-shipments-list';

export const ActiveShipmentsPage = () => {
  return (
    <>
      <Helmet>
        <title>Active Shipments | Field Agent</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Active Shipments
          </h1>
          <p className="text-muted-foreground">
            Manage your assigned shipments
          </p>
        </div>

        <ActiveShipmentsList />
      </div>
    </>
  );
};
