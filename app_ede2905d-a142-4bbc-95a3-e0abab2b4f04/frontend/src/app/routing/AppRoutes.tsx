import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/app/layouts';
import { ActiveShipmentsPage } from '@/pages/active-shipments';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        {/* Default redirect to main page */}
        <Route path="/" element={<Navigate to="/activeshipments" replace />} />

        {/* Main application page */}
        <Route path="/activeshipments" element={<ActiveShipmentsPage />} />

        {/* Shipment detail page */}
        <Route
          path="/shipments/:id"
          element={<div>Shipment Detail Page (TODO)</div>}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/activeshipments" replace />} />
      </Route>
    </Routes>
  );
};
