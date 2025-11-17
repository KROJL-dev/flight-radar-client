import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import LoginPage from "@/pages/Login/ui";
import MapPage from "@/pages/Map/ui";

const RootLayout: React.FC = () => {
  return <Outlet />;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Navigate to="/login" replace />} />

          <Route path="login" element={<LoginPage />} />
          <Route path="map" element={<MapPage />} />

          <Route path="*" element={<div>Page not found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
