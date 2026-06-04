import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './useAuth'

export function ClientGuard() {
  const { isClient } = useAuth()
  if (!isClient) return <Navigate to="/products" replace />
  return <Outlet />
}
