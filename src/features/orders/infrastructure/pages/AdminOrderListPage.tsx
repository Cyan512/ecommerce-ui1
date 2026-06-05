import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminOrders } from '../../application/useOrders'

const ESTADOS = ['PENDIENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO']

export default function AdminOrderListPage() {
  const { orders, loading, error, updateStatus } = useAdminOrders()
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatusChange = async (id: string, estado: string) => {
    setUpdating(id)
    await updateStatus(id, estado)
    setUpdating(null)
  }

  if (loading) return <p>Cargando pedidos...</p>
  if (error) return <p className="text-destructive">{error}</p>

  if (orders.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Gestión de Pedidos</CardTitle></CardHeader>
        <CardContent><p className="text-muted-foreground">No hay pedidos registrados.</p></CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestión de Pedidos</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium">ID</th>
              <th className="pb-2 font-medium">Cliente</th>
              <th className="pb-2 font-medium">Fecha</th>
              <th className="pb-2 font-medium">Total</th>
              <th className="pb-2 font-medium">Estado</th>
              <th className="pb-2 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="py-2 font-mono text-xs">{order.id.slice(0, 8)}</td>
                <td className="py-2 text-xs">{order.usuarioEmail ?? '—'}</td>
                <td className="py-2">{new Date(order.fechaCreacion).toLocaleDateString()}</td>
                <td className="py-2">${order.total.toFixed(2)}</td>
                <td className="py-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium">{order.estado}</span>
                </td>
                <td className="py-2">
                  <select
                    className="rounded border px-2 py-1 text-xs"
                    value={order.estado}
                    disabled={updating === order.id}
                    onChange={e => handleStatusChange(order.id, e.target.value)}
                  >
                    {ESTADOS.map(e => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
