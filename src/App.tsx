import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import RegisterSale from "./pages/RegisterSale";
import History from "./pages/History";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Quotations from "./pages/Quotations";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="registrar" element={<RegisterSale />} />
        <Route path="historial" element={<History />} />
        <Route path="productos" element={<Products />} />
        <Route path="informes" element={<Reports />} />
        <Route path="cotizaciones" element={<Quotations />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
