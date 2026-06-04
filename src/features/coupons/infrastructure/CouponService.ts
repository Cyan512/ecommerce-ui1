import { http } from '@/core/infrastructure/http/client'
import type { CouponRepository } from '../domain/ports'
import type { Cupon } from '../domain/models'

class CouponService implements CouponRepository {
  getByCode(codigo: string): Promise<Cupon> {
    return http.get<Cupon>(`/api/coupons/${encodeURIComponent(codigo)}`)
  }
}

export const couponService = new CouponService()
