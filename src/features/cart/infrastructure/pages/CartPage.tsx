import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCart } from '../../application/useCart'

export default function CartPage() {
  const { cart, loading, error, removeItem, clearCart } = useCart()

  if (loading) return <p>Cargando carrito...</p>
  if (error) return <p className="text-destructive">{error}</p>
  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="mb-4 text-2xl font-bold">Tu carrito está vacío</h1>
        <Link to="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Carrito</h1>
        <Button variant="destructive" onClick={clearCart}>Vaciar carrito</Button>
      </div>
      <div className="space-y-4">
        {cart.items.map(item => (
          <Card key={item.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <Link to={`/products/${item.productoId}`} className="font-medium hover:underline">
                  {item.productoNombre}
                </Link>
                <p className="text-sm text-muted-foreground">
                  ${item.precioUnitario.toFixed(2)} x {item.cantidad}
                </p>
                <p className="text-sm font-medium">Subtotal: ${item.subtotal.toFixed(2)}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => removeItem(item.id)}>Eliminar</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="mb-4 text-xl font-bold">Total: ${cart.total.toFixed(2)}</p>
        <Link to="/orders/new">
          <Button>Ir a pagar</Button>
        </Link>
      </div>
    </div>
  )
}
