import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/core/infrastructure/auth/useAuth'
import { useProductDetail } from '../../application/useProducts'
import { useReviews } from '@/features/reviews/application/useReviews'
import { cartService } from '@/features/cart/infrastructure/CartService'
import { wishlistService } from '@/features/wishlist/infrastructure/WishlistService'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { product, loading, error } = useProductDetail(id!)
  const { isClient } = useAuth()
  const { reviews, loading: revLoading, create: createReview, remove: deleteReview } = useReviews(id!)

  const [cartMsg, setCartMsg] = useState<string | null>(null)
  const [wishMsg, setWishMsg] = useState<string | null>(null)
  const [revScore, setRevScore] = useState(5)
  const [revComment, setRevComment] = useState('')
  const [revSubmitting, setRevSubmitting] = useState(false)
  const [revDeleteErr, setRevDeleteErr] = useState<string | null>(null)

  const handleAddToCart = async () => {
    if (!id) return
    try {
      setCartMsg(null)
      await cartService.addItem({ productoId: id, cantidad: 1 })
      setCartMsg('✓ Agregado al carrito')
    } catch {
      setCartMsg('Error al agregar al carrito')
    }
  }

  const handleAddToWishlist = async () => {
    if (!id) return
    try {
      setWishMsg(null)
      await wishlistService.addItem(id)
      setWishMsg('✓ Agregado a wishlist')
    } catch {
      setWishMsg('Error al agregar a wishlist')
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    setRevSubmitting(true)
    try {
      await createReview({ productoId: id, calificacion: revScore, comentario: revComment || undefined })
      setRevComment('')
      setRevScore(5)
    } catch {
      /* error is handled inside hook */
    } finally {
      setRevSubmitting(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      setRevDeleteErr(null)
      await deleteReview(reviewId)
    } catch {
      setRevDeleteErr('No puedes eliminar una reseña de otro usuario')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error || !product) return <p className="text-destructive">{error ?? 'Producto no encontrado'}</p>

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/products" className="mb-4 block text-sm text-muted-foreground hover:underline">
        ← Volver a productos
      </Link>

      <Card className="overflow-hidden">
        {product.imagenUrl && (
          <img src={product.imagenUrl} alt={product.nombre} className="h-64 w-full object-cover" />
        )}
        <CardHeader>
          <CardTitle className="text-2xl">{product.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{product.descripcion}</p>
          <p className="text-3xl font-bold">${product.precio.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">Stock disponible: {product.stock}</p>

          {isClient && (
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAddToCart}>Agregar al carrito</Button>
              <Button variant="outline" onClick={handleAddToWishlist}>Agregar a wishlist</Button>
            </div>
          )}
          {cartMsg && <p className="text-sm text-green-600">{cartMsg}</p>}
          {wishMsg && <p className="text-sm text-green-600">{wishMsg}</p>}
        </CardContent>
      </Card>

      <section className="mt-8">
        <h2 className="mb-4 text-xl font-bold">Reseñas</h2>

        {isClient && (
          <Card className="mb-6">
            <CardHeader><CardTitle className="text-lg">Escribe una reseña</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleReviewSubmit} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="score">Calificación</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(v => (
                      <button key={v} type="button" onClick={() => setRevScore(v)}
                        className={`h-8 w-8 rounded text-sm font-bold ${v <= revScore ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="comment">Comentario</Label>
                  <Input id="comment" value={revComment} onChange={e => setRevComment(e.target.value)} placeholder="Tu opinión..." />
                </div>
                <Button type="submit" disabled={revSubmitting}>
                  {revSubmitting ? 'Enviando...' : 'Publicar reseña'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {revDeleteErr && <p className="mb-2 text-sm text-destructive">{revDeleteErr}</p>}

        {revLoading ? (
          <p>Cargando reseñas...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground">No hay reseñas aún.</p>
        ) : (
          <div className="space-y-3">
            {reviews.map(r => (
              <Card key={r.id}>
                <CardContent className="flex items-start justify-between py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{r.usuarioNombre}</span>
                      <span className="text-xs text-muted-foreground">{new Date(r.fecha).toLocaleDateString()}</span>
                    </div>
                    <div className="mt-1 flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(v => (
                        <span key={v} className={`text-sm ${v <= r.calificacion ? 'text-primary' : 'text-muted-foreground'}`}>★</span>
                      ))}
                    </div>
                    {r.comentario && <p className="mt-1 text-sm">{r.comentario}</p>}
                  </div>
                  {isClient && (
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteReview(r.id)}>Eliminar</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
