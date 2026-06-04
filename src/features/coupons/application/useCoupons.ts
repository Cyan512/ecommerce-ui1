import { useState } from 'react'
import { couponService } from '../infrastructure/CouponService'
import type { Cupon } from '../domain/models'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useCoupon() {
  const [cupon, setCupon] = useState<Cupon | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const check = async (codigo: string) => {
    setLoading(true)
    setError(null)
    setCupon(null)
    try {
      const data = await couponService.getByCode(codigo)
      setCupon(data)
    } catch (e: unknown) {
      setError(getErrorMessage(e))
    } finally {
      setLoading(false)
    }
  }

  return { cupon, loading, error, check }
}
