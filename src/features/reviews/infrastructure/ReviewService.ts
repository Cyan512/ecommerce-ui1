import { http } from '@/core/infrastructure/http/client'
import type { ReviewRepository } from '../domain/ports'
import type { Resenia, ReseniaRequest } from '../domain/models'

class ReviewService implements ReviewRepository {
  listByProduct(productoId: string): Promise<Resenia[]> {
    return http.get<Resenia[]>(`/api/reviews/product/${productoId}`)
  }

  create(data: ReseniaRequest): Promise<Resenia> {
    return http.post<Resenia>('/api/reviews', data)
  }

  delete(id: string): Promise<void> {
    return http.delete(`/api/reviews/${id}`)
  }
}

export const reviewService = new ReviewService()
