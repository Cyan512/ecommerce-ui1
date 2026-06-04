import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const links = [
  {
    to: '/admin/products',
    title: 'Productos',
    description: 'Gestionar catálogo de productos (crear, editar, desactivar)',
  },
  {
    to: '/admin/categories',
    title: 'Categorías',
    description: 'Administrar categorías y subcategorías',
  },
  {
    to: '/admin/orders',
    title: 'Pedidos',
    description: 'Ver y actualizar estado de pedidos',
  },
]

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Panel de Administración</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map(link => (
          <Link key={link.to} to={link.to}>
            <Card className="h-full transition-colors hover:bg-muted/50">
              <CardHeader>
                <CardTitle>{link.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
