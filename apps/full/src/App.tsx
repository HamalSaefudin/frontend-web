import { ModalProvider } from "@frontend/ui"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { LoginScreen, RegisterScreen, ProtectedLayout, AppLayout } from "@frontend/auth"
import { DashboardScreen } from "@frontend/dashboard"
import { MasterCabangScreen, MasterCoaScreen, MasterKasScreen, MasterLocatorScreen, MasterServiceScreen } from "@frontend/master-data"
import { FjbScreen, EkspedisiInventoryScreen, PdiScreen } from "@frontend/order"
import { LeadsScreen } from "@frontend/delivery"
import { NAV_GROUPS } from "./navigation"

const isAuthenticated = () => !!localStorage.getItem("user")

function App() {
  return (
    <ModalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginScreen />} />
          <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <RegisterScreen />} />
          <Route element={<ProtectedLayout />}>
            <Route element={<AppLayout navGroups={NAV_GROUPS} />}>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/leads" element={<LeadsScreen />} />
              <Route path="/master-service" element={<MasterServiceScreen />} />
              <Route path="/master-cabang" element={<MasterCabangScreen />} />
              <Route path="/master-locator" element={<MasterLocatorScreen />} />
              <Route path="/ekspedisi-inventory" element={<EkspedisiInventoryScreen />} />
              <Route path="/fjb" element={<FjbScreen />} />
              <Route path="/pdi" element={<PdiScreen />} />
              <Route path="/master-kas" element={<MasterKasScreen />} />
              <Route path="/master-coa" element={<MasterCoaScreen />} />
            </Route>
          </Route>
          <Route path="/" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ModalProvider>
  )
}

export default App
