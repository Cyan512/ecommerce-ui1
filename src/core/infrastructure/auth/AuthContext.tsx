import { createContext } from 'react'
import type { AuthResponse } from '@/features/auth/domain/models'

interface User {
  email: string
  nombre: string
  tipo: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  isClient: boolean
  login: (res: AuthResponse) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)

export type { User }
