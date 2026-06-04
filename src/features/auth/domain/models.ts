export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  nombre: string
}

export interface AuthResponse {
  token: string
  email: string
  nombre: string
  tipo: string
}

export interface GoogleAuthParams {
  email: string
  nombre: string
  google_id: string
}
