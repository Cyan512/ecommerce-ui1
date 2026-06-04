import { http } from '@/core/infrastructure/http/client'
import type { DireccionRepository } from '../domain/ports'
import type { Direccion, DireccionRequest } from '../domain/models'

class DireccionService implements DireccionRepository {
  list(): Promise<Direccion[]> {
    return http.get<Direccion[]>('/api/direcciones')
  }

  create(data: DireccionRequest): Promise<Direccion> {
    return http.post<Direccion>('/api/direcciones', data)
  }

  delete(id: string): Promise<void> {
    return http.delete(`/api/direcciones/${id}`)
  }
}

export const direccionService = new DireccionService()
