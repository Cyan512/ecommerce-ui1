import type { Direccion, DireccionRequest } from './models'

export interface DireccionRepository {
  list(): Promise<Direccion[]>
  create(data: DireccionRequest): Promise<Direccion>
  delete(id: string): Promise<void>
}
