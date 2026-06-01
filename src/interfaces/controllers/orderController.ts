import { Request, Response, NextFunction } from "express";
import { SupabaseOrderRepository } from "@infrastructure/database/repositories/SupabaseOrderRepository";
import {
  GetAllOrders, GetOrderById,
  CreateOrder, UpdateOrderStatus,
} from "@application/use-cases/order";

const repo         = new SupabaseOrderRepository();
const getAll       = new GetAllOrders(repo);
const getById      = new GetOrderById(repo);
const createOrder  = new CreateOrder(repo);
const updateStatus = new UpdateOrderStatus(repo);

export const orderController = {
  async getAll(_req: Request, res: Response, next: NextFunction) {
    try { return res.json(await getAll.execute()); } catch (e) { next(e); }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try { return res.json(await getById.execute(req.params.id)); } catch (e) { next(e); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { customerName, customerEmail, items } = req.body;
      if (!customerName || !customerEmail || !items?.length)
        return res.status(400).json({ message: "customerName, customerEmail e items son requeridos" });
      return res.status(201).json(await createOrder.execute(req.body));
    } catch (e) { next(e); }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      if (!["pendiente", "enviado", "entregado"].includes(status))
        return res.status(400).json({ message: "Estado inválido. Use: pendiente, enviado, entregado" });
      return res.json(await updateStatus.execute(req.params.id, { status }));
    } catch (e) { next(e); }
  },
};
