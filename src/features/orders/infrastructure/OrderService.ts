import { http } from '@/core/infrastructure/http/client'
import type { OrderRepository } from '../domain/ports'
import type { Pedido, CreatePedidoRequest, UpdatePedidoStatusRequest } from '../domain/models'

class OrderService implements OrderRepository {
  create(data: CreatePedidoRequest): Promise<Pedido> {
    return http.post<Pedido>('/api/orders', data)
  }

  listMyOrders(): Promise<Pedido[]> {
    return http.get<Pedido[]>('/api/orders')
  }

  getById(id: string): Promise<Pedido> {
    return http.get<Pedido>(`/api/orders/${id}`)
  }

  listAll(): Promise<Pedido[]> {
    return http.get<Pedido[]>('/api/admin/orders')
  }

  updateStatus(id: string, data: UpdatePedidoStatusRequest): Promise<Pedido> {
    return http.put<Pedido>(`/api/admin/orders/${id}/status`, data)
  }
}

export const orderService = new OrderService()
