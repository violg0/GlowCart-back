import { Order, CreateOrderDTO, UpdateOrderStatusDTO } from "@domain/entities/Order";

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(data: CreateOrderDTO): Promise<Order>;
  updateStatus(id: string, data: UpdateOrderStatusDTO): Promise<Order | null>;
}
