import { http } from '@/core/infrastructure/http/client'
import type { AdminUserRequest, AdminUserResponse } from '../domain/models'

class AdminUserService {
  list(): Promise<AdminUserResponse[]> {
    return http.get<AdminUserResponse[]>('/api/admin/users')
  }

  create(data: AdminUserRequest): Promise<AdminUserResponse> {
    return http.post<AdminUserResponse>('/api/admin/users', data)
  }

  block(id: string): Promise<AdminUserResponse> {
    return http.put<AdminUserResponse>(`/api/admin/users/${id}/block`, {})
  }

  unblock(id: string): Promise<AdminUserResponse> {
    return http.put<AdminUserResponse>(`/api/admin/users/${id}/unblock`, {})
  }

  remove(id: string): Promise<void> {
    return http.delete(`/api/admin/users/${id}`)
  }
}

export const adminUserService = new AdminUserService()
