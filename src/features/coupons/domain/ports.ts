import type { Cupon } from './models'

export interface CouponRepository {
  getByCode(codigo: string): Promise<Cupon>
}
