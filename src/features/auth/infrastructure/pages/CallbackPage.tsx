import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/infrastructure/auth/useAuth'

export default function CallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      login({ token, email: '', nombre: '', tipo: 'CLIENTE' })
      navigate('/')
    }
  }, [params, login, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Procesando autenticación...</p>
    </div>
  )
}
