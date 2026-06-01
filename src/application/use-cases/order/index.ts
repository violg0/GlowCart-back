import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { CreateOrderDTO, UpdateOrderStatusDTO } from "@domain/entities/Order";

export class GetAllOrders {
  constructor(private repo: IOrderRepository) {}
  execute() { return this.repo.findAll(); }
}

export class GetOrderById {
  constructor(private repo: IOrderRepository) {}
  async execute(id: string) {
    const order = await this.repo.findById(id);
    if (!order) throw new Error("Pedido no encontrado");
    return order;
  }
}

export class CreateOrder {
  constructor(private repo: IOrderRepository) {}
  execute(data: CreateOrderDTO) { return this.repo.create(data); }
}

export class UpdateOrderStatus {
  constructor(private repo: IOrderRepository) {}
  async execute(id: string, data: UpdateOrderStatusDTO) {
    const order = await this.repo.updateStatus(id, data);
    if (!order) throw new Error("Pedido no encontrado");
    return order;
  }
}
