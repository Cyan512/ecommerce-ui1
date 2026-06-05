import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useOrderDetail } from '../../application/useOrders'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { order, loading, error } = useOrderDetail(id!)

  if (loading) return <p>Cargando...</p>
  if (error || !order) return <p className="text-destructive">{error ?? 'Pedido no encontrado'}</p>

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/orders" className="mb-4 block text-sm text-muted-foreground hover:underline">
        ← Mis pedidos
      </Link>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pedido #{order.id.slice(0, 8)}</CardTitle>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{order.estado}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{new Date(order.fechaCreacion).toLocaleString()}</p>

          <div className="space-y-2">
            <h3 className="font-medium">Items</h3>
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="flex justify-between border-b pb-2 text-sm">
                <span>{item.productoNombre} x{item.cantidad}</span>
                <span>${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1 border-t pt-4 text-sm">
            {order.subtotal !== undefined && (
              <div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div>
            )}
            {(order.descuento ?? 0) > 0 && (
              <div className="flex justify-between"><span>Descuento</span><span>-${order.descuento!.toFixed(2)}</span></div>
            )}
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
