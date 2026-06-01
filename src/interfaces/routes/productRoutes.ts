import { Router } from "express";
import { productController } from "@interfaces/controllers/productController";
import { requireAdmin, requireSuperAdmin } from "@interfaces/middlewares/authMiddleware";
const router = Router();

/**
 * @swagger
 * /api/v1/products: 
 *   get:
 *     tags: [Products]
 *     summary: Obtener todos los productos
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *         description: Filtrar por categoría (slug)
 *       - in: query
 *         name: collection
 *         schema: { type: string }
 *         description: Filtrar por colección (slug)
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get("/", productController.getAll);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Obtener un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", productController.getById);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     tags: [Products]
 *     summary: Crear producto (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, description, image, categorySlug, stock]
 *             properties:
 *               name:           { type: string }
 *               price:          { type: number }
 *               description:    { type: string }
 *               image:          { type: string }
 *               categorySlug:   { type: string }
 *               collectionSlug: { type: string }
 *               stock:          { type: number }
 *               badge:          { type: string }
 *               isBestSeller:   { type: boolean }
 *               isNew:          { type: boolean }
 *     responses:
 *       201:
 *         description: Producto creado
 */
router.post("/", requireAdmin, productController.create);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Editar producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put("/:id", requireAdmin, productController.update);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Eliminar producto (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Producto eliminado
 */
router.delete("/:id", requireSuperAdmin, productController.delete);

export default router;
