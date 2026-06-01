import { supabase } from "@infrastructure/database/supabaseClient";
import { IOrderRepository } from "@domain/repositories/IOrderRepository";
import { Order, OrderItem, CreateOrderDTO, UpdateOrderStatusDTO } from "@domain/entities/Order";

export class SupabaseOrderRepository implements IOrderRepository {

  private mapItem(row: any): OrderItem {
    return {
      id:           row.id,
      orderId:      row.order_id,
      productId:    row.product_id,
      productName:  row.product_name,
      productImage: row.product_image,
      price:        row.price,
      quantity:     row.quantity,
    };
  }

  private mapOrder(row: any, items: OrderItem[]): Order {
    return {
      id:            row.id,
      customerName:  row.customer_name,
      customerEmail: row.customer_email,
      total:         row.total,
      status:        row.status,
      items,
      createdAt:     new Date(row.created_at),
    };
  }

  async findAll(): Promise<Order[]> {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    return (orders ?? []).map((o: any) =>
      this.mapOrder(o, (o.order_items ?? []).map(this.mapItem))
    );
  }

  async findById(id: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return this.mapOrder(data, (data.order_items ?? []).map(this.mapItem));
  }

  async create(dto: CreateOrderDTO): Promise<Order> {
    // 1. Resolver productos y calcular total
    const productIds = dto.items.map((i) => i.productId);
    const { data: products, error: pErr } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds);
    if (pErr) throw new Error(pErr.message);

    let total = 0;
    const resolvedItems = dto.items.map((item) => {
      const product = (products ?? []).find((p: any) => p.id === item.productId);
      if (!product) throw new Error(`Producto ${item.productId} no encontrado`);
      total += product.price * item.quantity;
      return { product, quantity: item.quantity };
    });

    // 2. Crear pedido
    const { data: order, error: oErr } = await supabase
      .from("orders")
      .insert({
        customer_name:  dto.customerName,
        customer_email: dto.customerEmail,
        total,
        status: "pendiente",
      })
      .select()
      .single();
    if (oErr) throw new Error(oErr.message);

    // 3. Crear items
    const itemsToInsert = resolvedItems.map(({ product, quantity }) => ({
      order_id:      order.id,
      product_id:    product.id,
      product_name:  product.name,
      product_image: product.image,
      price:         product.price,
      quantity,
    }));

    const { data: items, error: iErr } = await supabase
      .from("order_items")
      .insert(itemsToInsert)
      .select();
    if (iErr) throw new Error(iErr.message);

    return this.mapOrder(order, (items ?? []).map(this.mapItem));
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDTO): Promise<Order | null> {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: dto.status })
      .eq("id", id)
      .select("*, order_items(*)")
      .single();
    if (error || !data) return null;
    return this.mapOrder(data, (data.order_items ?? []).map(this.mapItem));
  }
}
