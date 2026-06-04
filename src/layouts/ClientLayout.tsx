import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/core/infrastructure/auth/useAuth'
import { Button } from '@/components/ui/button'

export default function ClientLayout() {
  const { isAuthenticated, isClient, user, logout, isAdmin } = useAuth()
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
            {isClient && (
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
                <Link to="/direcciones" className="text-sm font-medium hover:underline underline-offset-4">
                  Direcciones
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Admin
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {user?.nombre.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden flex-col sm:flex">
                    <span className="text-sm font-medium leading-tight">{user?.nombre}</span>
                    <span className="text-[10px] leading-tight text-muted-foreground">
                      {user?.tipo === 'ADMINISTRADOR' ? 'Admin' : user?.tipo === 'VENDEDOR' ? 'Staff' : 'Cliente'}
                    </span>
                  </div>
                </div>
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
