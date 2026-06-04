import { http } from '@/core/infrastructure/http/client'
import type { AuthRepository } from '../domain/ports'
import type { LoginRequest, RegisterRequest, AuthResponse, GoogleAuthParams } from '../domain/models'

class AuthService implements AuthRepository {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return http.post<AuthResponse>('/api/auth/login', data)
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return http.post<AuthResponse>('/api/auth/register', data)
  }

  async googleAuth(params: GoogleAuthParams): Promise<AuthResponse> {
    return http.post<AuthResponse>(
      `/api/auth/google?email=${encodeURIComponent(params.email)}&nombre=${encodeURIComponent(params.nombre)}&google_id=${encodeURIComponent(params.google_id)}`,
    )
  }
}

export const authService = new AuthService()
