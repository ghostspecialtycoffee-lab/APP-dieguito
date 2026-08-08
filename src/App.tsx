import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FarmsList from "./pages/FarmsList";
import FarmDetail from "./pages/FarmDetail";
import Diagnostic from "./pages/Diagnostic";
import WorkPlan from "./pages/WorkPlan";
import Visits from "./pages/Visits";
import VisitDetail from "./pages/VisitDetail";
import NewVisit from "./pages/NewVisit";
import Logbook from "./pages/Logbook";
import Reports from "./pages/Reports";
import Calendar from "./pages/Calendar";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";
import SeedBanner from "./components/SeedBanner";

export default function App() {
  return (
    <>
      <SeedBanner />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="fincas" element={<FarmsList />} />
          <Route path="fincas/:farmId" element={<FarmDetail />} />
          <Route path="fincas/:farmId/diagnostico" element={<Diagnostic />} />
          <Route path="fincas/:farmId/plan" element={<WorkPlan />} />
          <Route path="fincas/:farmId/visitas" element={<Visits />} />
          <Route path="fincas/:farmId/visitas/nueva" element={<NewVisit />} />
          <Route
            path="fincas/:farmId/visitas/:visitId"
            element={<VisitDetail />}
          />
          <Route path="fincas/:farmId/bitacora" element={<Logbook />} />
          <Route path="informes" element={<Reports />} />
          <Route path="calendario" element={<Calendar />} />
          <Route path="alertas" element={<Alerts />} />
          <Route path="configuracion" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
