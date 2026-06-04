import { useState } from 'react'
import { useAuth } from '@/core/infrastructure/auth/useAuth'
import { authService } from '../infrastructure/AuthService'
import type { LoginForm, RegisterForm } from './dto'

function getErrorMessage(e: unknown): string {
  const apiErr = e as { body?: { error?: string } }
  if (apiErr.body?.error) return apiErr.body.error
  const stdErr = e as Error
  if (stdErr.message) return stdErr.message
  return 'Error de conexión con el servidor'
}

export function useLogin() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (form: LoginForm): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.login(form)
      login(res)
      return true
    } catch (e: unknown) {
      setError(getErrorMessage(e))
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}

export function useRegister() {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (form: RegisterForm): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const res = await authService.register({
        email: form.email,
        password: form.password,
        nombre: form.nombre,
      })
      login(res)
      return true
    } catch (e: unknown) {
      setError(getErrorMessage(e))
      return false
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
