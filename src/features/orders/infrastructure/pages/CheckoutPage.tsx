import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCart } from '@/features/cart/application/useCart'
import { useDirecciones } from '@/features/users/application/useDirecciones'
import { useCoupon } from '@/features/coupons/application/useCoupons'
import { useCreateOrder } from '../../application/useOrders'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cart, loading: cartLoading, clearCart } = useCart()
  const { direcciones, loading: dirLoading, create: createDireccion } = useDirecciones()
  const { cupon, loading: cuponLoading, error: cuponError, check: checkCoupon } = useCoupon()
  const { submit: createOrder, loading: orderLoading, error: orderError } = useCreateOrder()

  const [selectedDirId, setSelectedDirId] = useState<string>('')
  const [couponCode, setCouponCode] = useState('')
  const [showNewDir, setShowNewDir] = useState(false)
  const [newDir, setNewDir] = useState({
    calle: '', colonia: '', ciudad: '', estado: '', codigoPostal: '', pais: 'Perú'
  })

  if (cartLoading || dirLoading) return <p>Cargando...</p>

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">Tu carrito está vacío</h1>
        <Link to="/products"><Button>Ver productos</Button></Link>
      </div>
    )
  }

  const handleSubmitOrder = async () => {
    const items = cart.items.map(i => ({ productoId: i.productoId, cantidad: i.cantidad }))
    const pedido = await createOrder({
      direccionId: selectedDirId || undefined,
      cuponCodigo: couponCode || undefined,
      items,
    })
    if (pedido) {
      await clearCart()
      navigate(`/orders/${pedido.id}`)
    }
  }

  const handleNewDir = async (e: React.FormEvent) => {
    e.preventDefault()
    await createDireccion(newDir)
    setShowNewDir(false)
    setNewDir({ calle: '', colonia: '', ciudad: '', estado: '', codigoPostal: '', pais: 'Perú' })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Checkout</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">Resumen del carrito</CardTitle></CardHeader>
          <CardContent>
            {cart.items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b py-2 last:border-0">
                <div>
                  <p className="font-medium">{item.productoNombre}</p>
                  <p className="text-sm text-muted-foreground">
                    ${item.precioUnitario.toFixed(2)} x {item.cantidad}
                  </p>
                </div>
                <p className="font-medium">${item.subtotal.toFixed(2)}</p>
              </div>
            ))}
            <div className="pt-2 text-right text-lg font-bold">
              Total: ${cart.total.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Dirección de envío</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {direcciones.length === 0 && !showNewDir && (
              <p className="text-sm text-muted-foreground">No tienes direcciones guardadas.</p>
            )}
            {direcciones.map(d => (
              <label key={d.id} className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 has-[:checked]:border-primary">
                <input type="radio" name="direccion" value={d.id}
                  checked={selectedDirId === d.id}
                  onChange={() => setSelectedDirId(d.id)}
                  className="mt-1" />
                <div>
                  <p className="font-medium">{d.calle}</p>
                  <p className="text-sm text-muted-foreground">{d.colonia}, {d.ciudad}, {d.estado} - {d.codigoPostal}</p>
                </div>
              </label>
            ))}
            {showNewDir ? (
              <form onSubmit={handleNewDir} className="space-y-3 border-t pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="calle">Calle</Label>
                    <Input id="calle" value={newDir.calle} onChange={e => setNewDir(p => ({ ...p, calle: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="colonia">Colonia</Label>
                    <Input id="colonia" value={newDir.colonia} onChange={e => setNewDir(p => ({ ...p, colonia: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ciudad">Ciudad</Label>
                    <Input id="ciudad" value={newDir.ciudad} onChange={e => setNewDir(p => ({ ...p, ciudad: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="estado">Estado</Label>
                    <Input id="estado" value={newDir.estado} onChange={e => setNewDir(p => ({ ...p, estado: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="cp">Código Postal</Label>
                    <Input id="cp" value={newDir.codigoPostal} onChange={e => setNewDir(p => ({ ...p, codigoPostal: e.target.value }))} required />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pais">País</Label>
                    <Input id="pais" value={newDir.pais} onChange={e => setNewDir(p => ({ ...p, pais: e.target.value }))} required />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Guardar dirección</Button>
                  <Button type="button" variant="outline" onClick={() => setShowNewDir(false)}>Cancelar</Button>
                </div>
              </form>
            ) : (
              <Button variant="outline" onClick={() => setShowNewDir(true)}>
                + Nueva dirección
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Cupón de descuento</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="Código del cupón" value={couponCode}
                onChange={e => setCouponCode(e.target.value)} />
              <Button variant="outline" onClick={() => checkCoupon(couponCode)} disabled={cuponLoading || !couponCode}>
                {cuponLoading ? 'Validando...' : 'Validar'}
              </Button>
            </div>
            {cupon && (
              <p className="text-sm text-green-600">
                Cupón válido: {cupon.tipoDescuento === 'PORCENTAJE' ? `${cupon.valorDescuento}%` : `S/ ${cupon.valorDescuento}`} de descuento
                {cupon.montoMinimo > 0 && ` (mín. S/ ${cupon.montoMinimo})`}
              </p>
            )}
            {cuponError && <p className="text-sm text-destructive">{cuponError}</p>}
          </CardContent>
        </Card>

        {orderError && <p className="text-destructive">{orderError}</p>}

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/cart')}>Volver al carrito</Button>
          <Button onClick={handleSubmitOrder} disabled={orderLoading}>
            {orderLoading ? 'Procesando...' : 'Confirmar pedido'}
          </Button>
        </div>
      </div>
    </div>
  )
}
