import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/infrastructure/auth/useAuth'
import { Button } from '@/components/ui/button'

export default function ClientLayout() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="font-heading text-xl font-bold tracking-tight">
            Ecommerce
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/products" className="text-sm font-medium hover:underline underline-offset-4">
              Productos
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/cart" className="text-sm font-medium hover:underline underline-offset-4">
                  Carrito
                </Link>
                <Link to="/wishlist" className="text-sm font-medium hover:underline underline-offset-4">
                  Wishlist
                </Link>
                <Link to="/orders" className="text-sm font-medium hover:underline underline-offset-4">
                  Pedidos
                </Link>
                {isAdmin && (
                  <Link to="/admin/products" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-muted-foreground">{user?.nombre}</span>
                <Button variant="outline" size="sm" onClick={() => { logout(); navigate('/auth/login') }}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate('/auth/login')}>
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
