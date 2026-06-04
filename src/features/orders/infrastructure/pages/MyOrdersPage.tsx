import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMyOrders } from '../../application/useOrders'

export default function MyOrdersPage() {
  const { orders, loading, error } = useMyOrders()

  if (loading) return <p>Cargando pedidos...</p>
  if (error) return <p className="text-destructive">{error}</p>

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="mb-4 text-2xl font-bold">No tienes pedidos</h1>
        <Link to="/products"><Button>Ver productos</Button></Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Mis Pedidos</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Pedido #{order.id.slice(0, 8)}</CardTitle>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{order.estado}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm text-muted-foreground">{new Date(order.fechaCreacion).toLocaleDateString()}</p>
              <p className="mb-3 text-lg font-bold">Total: ${order.total.toFixed(2)}</p>
              <Link to={`/orders/${order.id}`}>
                <Button variant="outline" size="sm">Ver detalle</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
