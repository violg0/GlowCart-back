import { Router } from "express";
import { collectionController } from "@interfaces/controllers/collectionController";
import { requireAdmin }         from "@interfaces/middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/collections:
 *   get:
 *     tags: [Collections]
 *     summary: Obtener todas las colecciones
 *     responses:
 *       200:
 *         description: Lista de colecciones
 */
router.get("/", collectionController.getAll);

/**
 * @swagger
 * /api/collections/{slug}:
 *   get:
 *     tags: [Collections]
 *     summary: Obtener colección por slug
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *         example: angelic-silvery
 *     responses:
 *       200:
 *         description: Colección encontrada
 *       404:
 *         description: Colección no encontrada
 */
router.get("/:slug", collectionController.getBySlug);

/**
 * @swagger
 * /api/collections:
 *   post:
 *     tags: [Collections]
 *     summary: Crear colección (admin)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Colección creada
 */
router.post("/", requireAdmin, collectionController.create);

/**
 * @swagger
 * /api/collections/{slug}:
 *   put:
 *     tags: [Collections]
 *     summary: Editar colección (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Colección actualizada
 */
router.put("/:slug", requireAdmin, collectionController.update);

export default router;
