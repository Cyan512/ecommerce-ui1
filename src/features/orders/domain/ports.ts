import type { Pedido, CreatePedidoRequest, UpdatePedidoStatusRequest } from './models'

export interface OrderRepository {
  create(data: CreatePedidoRequest): Promise<Pedido>
  listMyOrders(): Promise<Pedido[]>
  getById(id: string): Promise<Pedido>
  listAll(): Promise<Pedido[]>
  updateStatus(id: string, data: UpdatePedidoStatusRequest): Promise<Pedido>
}
