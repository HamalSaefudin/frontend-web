import { Navigate, Outlet } from "react-router-dom"

const isAuthenticated = () => !!localStorage.getItem('user')

export default function ProtectedLayout() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <Outlet />
}
