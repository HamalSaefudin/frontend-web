import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { ModalProvider } from "@/components/ModalProvider";
import ProtectedLayout from "@/layouts/ProtectedLayout";
import { LoginScreen } from "./modules/auth/LoginScreen";
import { RegisterScreen } from "./modules/auth/RegisterScreen";
import { DashboardScreen } from "./modules/dashboard/DashboardScreen";
import { LeadsScreen } from "./modules/leads/LeadsScreen";
import { MasterServiceScreen } from "./modules/master-service/MasterServiceScreen";
import { MasterCabangScreen } from "./modules/master-cabang/MasterCabangScreen";
import { EkspedisiInventoryScreen } from "./modules/ekspedisi-inventory/EkspedisiInventoryScreen";
import { FjbScreen } from "./modules/fjb/FjbScreen";
import { PdiScreen } from "./modules/pdi/PdiScreen";
import { MasterKasScreen } from "./modules/master-kas/MasterKasScreen";
import { MasterLocatorScreen } from "./modules/master-locator/MasterLocatorScreen";

const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <ModalProvider>
      <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginScreen />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <RegisterScreen />
            )
          }
        />
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<DashboardScreen />} />
          <Route path="/leads" element={<LeadsScreen />} />
          <Route path="/master-service" element={<MasterServiceScreen />} />
          <Route path="/master-cabang" element={<MasterCabangScreen />} />
          <Route path="/master-locator" element={<MasterLocatorScreen />} />
          <Route path="/ekspedisi-inventory" element={<EkspedisiInventoryScreen />} />
          <Route path="/fjb" element={<FjbScreen />} />
          <Route path="/pdi" element={<PdiScreen />} />
          <Route path="/master-kas" element={<MasterKasScreen />} />
        </Route>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated() ? "/dashboard" : "/login"}
              replace
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Router>
    </ModalProvider>
  );
}

export default App;