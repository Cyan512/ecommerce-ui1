import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/core/infrastructure/auth/useAuth'

export default function AuthLayout() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Outlet />
}
