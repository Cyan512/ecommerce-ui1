import type { LoginRequest, RegisterRequest, AuthResponse, GoogleAuthParams } from './models'

export interface AuthRepository {
  login(data: LoginRequest): Promise<AuthResponse>
  register(data: RegisterRequest): Promise<AuthResponse>
  googleAuth(params: GoogleAuthParams): Promise<AuthResponse>
}
