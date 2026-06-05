import { http } from '@/core/infrastructure/http/client'

export interface ProfileResponse {
  id: string
  email: string
  nombre: string
  tipo: string
  activo: boolean
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangeNombreRequest {
  nombre: string
}

class ProfileService {
  get(): Promise<ProfileResponse> {
    return http.get<ProfileResponse>('/api/profile')
  }

  changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    return http.put<{ message: string }>('/api/profile/password', data)
  }

  changeNombre(data: ChangeNombreRequest): Promise<ProfileResponse> {
    return http.put<ProfileResponse>('/api/profile/nombre', data)
  }
}

export const profileService = new ProfileService()
