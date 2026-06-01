import { Request, Response, NextFunction } from "express";
import { SupabaseProductRepository } from "@infrastructure/database/repositories/SupabaseProductRepository";
import {
  GetAllProducts, GetProductById,
  CreateProduct, UpdateProduct, DeleteProduct,
} from "@application/use-cases/product";

const repo       = new SupabaseProductRepository();
const getAll     = new GetAllProducts(repo);
const getById    = new GetProductById(repo);
const createProd = new CreateProduct(repo);
const updateProd = new UpdateProduct(repo);
const deleteProd = new DeleteProduct(repo);

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const { category, collection } = req.query;

    let result;
    if (category)        result = await repo.findByCategory(category as string, { page, limit });
    else if (collection) result = await repo.findByCollection(collection as string, { page, limit });
    else                 result = await getAll.execute({ page, limit });

    return res.json(result);
  } catch (e) { next(e); }
},

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await getById.execute(req.params.id);
      return res.json(product);
    } catch (e) { next(e); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try { 
      const { name, price, description, image, categorySlug, stock } = req.body;
      if (!name)         return res.status(400).json({ message: "El nombre es requerido" });
      if (!price)        return res.status(400).json({ message: "El precio es requerido" });
      if (price <= 0)    return res.status(400).json({ message: "El precio debe ser mayor a 0" });
      if (!description)  return res.status(400).json({ message: "La descripción es requerida" });
      if (!image)        return res.status(400).json({ message: "La imagen es requerida" });
      if (!categorySlug) return res.status(400).json({ message: "La categoría es requerida" });
      if (stock < 0)     return res.status(400).json({ message: "El stock no puede ser negativo" });

      const product = await createProd.execute(req.body);
      return res.status(201).json(product);
    } catch (e) { next(e); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { price, stock } = req.body;
      if (price !== undefined && price <= 0) return res.status(400).json({ message: "El precio debe ser mayor a 0" });
      if (stock !== undefined && stock < 0)  return res.status(400).json({ message: "El stock no puede ser negativo" });

      const product = await updateProd.execute(req.params.id, req.body);
      return res.json(product);
    } catch (e) { next(e); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteProd.execute(req.params.id);
      return res.json({ message: "Producto eliminado" });
    } catch (e) { next(e); }
  },
};


