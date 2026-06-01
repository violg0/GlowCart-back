export type OrderStatus = "pendiente" | "enviado" | "entregado";

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
}

export type CreateOrderDTO = {
  customerName: string;
  customerEmail: string;
  items: { productId: string; quantity: number }[];
};

export type UpdateOrderStatusDTO = { status: OrderStatus };
