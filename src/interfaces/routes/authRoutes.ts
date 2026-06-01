import { Router } from "express";
import { authController } from "@interfaces/controllers/authController";
import { requireAdmin, requireSuperAdmin }   from "@interfaces/middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo admin (solo superadmin puede crear admins)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: nuevo@glowcart.com }
 *               password: { type: string, example: password123 }
 *               role:     { type: string, enum: [superadmin, admin], example: admin }
 *     responses:
 *       201:
 *         description: Admin creado y token generado
 *       409:
 *         description: Email ya registrado
 */
router.post("/register", requireSuperAdmin, authController.register);
 
/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login del administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: admin@glowcart.com }
 *               password: { type: string, example: admin1234 }
 *     responses:
 *       200:
 *         description: Token JWT generado
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", authController.login);
 
/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Datos del admin autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del admin
 *       401:
 *         description: Token inválido
 */
router.get("/me", requireAdmin, authController.me);
 
export default router;