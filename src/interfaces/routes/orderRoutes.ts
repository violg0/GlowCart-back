import { Router } from "express";
import { orderController } from "@interfaces/controllers/orderController";
import { requireAdmin }    from "@interfaces/middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear un pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [customerName, customerEmail, items]
 *             properties:
 *               customerName:  { type: string, example: "Laura García" }
 *               customerEmail: { type: string, example: "laura@email.com" }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: string }
 *                     quantity:  { type: number }
 *     responses:
 *       201:
 *         description: Pedido creado
 */
router.post("/", orderController.create);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Ver todos los pedidos (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get("/", requireAdmin, orderController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Ver pedido por ID (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Pedido encontrado
 */
router.get("/:id", requireAdmin, orderController.getById);

/**
 * @swagger
 * /api/orders/{id}:
 *   patch:
 *     tags: [Orders]
 *     summary: Actualizar estado del pedido (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, enviado, entregado]
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch("/:id", requireAdmin, orderController.updateStatus);

export default router;
