import { Navigate } from "react-router-dom"
import { AppLayout } from "./AppLayout"

const isAuthenticated = () => !!localStorage.getItem('token')

export default function ProtectedLayout() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />
  return <AppLayout />
}