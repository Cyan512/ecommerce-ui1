import { Outlet, Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/core/infrastructure/auth/useAuth'

export default function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth()
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">
        <Link to="/admin/products" className="mb-6 block font-heading text-lg font-bold tracking-tight">
          Admin Panel
        </Link>
        <nav className="flex flex-col gap-2">
          <Link to="/admin/products" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Productos
          </Link>
          <Link to="/admin/categories" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Categorías
          </Link>
          <Link to="/admin/orders" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
            Pedidos
          </Link>
          <Link to="/" className="mt-4 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
            ← Volver a tienda
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
