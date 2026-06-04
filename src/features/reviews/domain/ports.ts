import type { Resenia, ReseniaRequest } from './models'

export interface ReviewRepository {
  listByProduct(productoId: string): Promise<Resenia[]>
  create(data: ReseniaRequest): Promise<Resenia>
  delete(id: string): Promise<void>
}
