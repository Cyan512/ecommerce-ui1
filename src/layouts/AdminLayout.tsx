import { Outlet, Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/core/infrastructure/auth/useAuth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/products', label: 'Productos' },
  { to: '/admin/categories', label: 'Categorías' },
  { to: '/admin/orders', label: 'Pedidos' },
]

export default function AdminLayout() {
  const { isAuthenticated, isAdmin, user } = useAuth()
  const location = useLocation()
  if (!isAuthenticated || !isAdmin) return <Navigate to="/" replace />

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-64 flex-col border-r bg-muted/30 p-4">
        <Link to="/admin" className="mb-6 block font-heading text-lg font-bold tracking-tight">
          Admin Panel
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted',
                location.pathname === item.to && 'bg-muted text-primary',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t pt-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {user?.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium leading-tight">{user?.nombre}</p>
              <p className="text-[10px] leading-tight text-muted-foreground">
                {user?.tipo === 'ADMINISTRADOR' ? 'Admin' : user?.tipo === 'VENDEDOR' ? 'Staff' : 'Cliente'}
              </p>
            </div>
          </div>
          <Link to="/" className="block rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
            ← Volver a tienda
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
