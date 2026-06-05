import { useState, useCallback, type ReactNode } from 'react'
import type { AuthResponse } from '@/features/auth/domain/models'
import { AuthContext } from './AuthContext'

function loadUser(): { email: string; nombre: string; tipo: string } | null {
  const raw = localStorage.getItem('auth_user')
  return raw ? JSON.parse(raw) : null
}

function loadToken(): string | null {
  return localStorage.getItem('auth_token')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(loadUser)
  const [token, setToken] = useState<string | null>(loadToken)

  const login = useCallback((res: AuthResponse) => {
    const u = { email: res.email, nombre: res.nombre, tipo: res.tipo }
    localStorage.setItem('auth_token', res.token)
    localStorage.setItem('auth_user', JSON.stringify(u))
    setToken(res.token)
    setUser(u)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }, [])

  const updateUser = useCallback((u: { email: string; nombre: string; tipo: string }) => {
    localStorage.setItem('auth_user', JSON.stringify(u))
    setUser(u)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.tipo === 'ADMINISTRADOR',
    isClient: user?.tipo === 'CLIENTE',
    login,
    logout,
    updateUser,
  }

  return <AuthContext value={value}>{children}</AuthContext>
}
