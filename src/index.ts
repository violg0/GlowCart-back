  import "dotenv/config";
  import express      from "express";
  import cors         from "cors";
  import { logger }       from "@interfaces/middlewares/loggerMiddleware";
  import { errorHandler } from "@interfaces/middlewares/errorMiddleware";
  import authRoutes       from "@interfaces/routes/authRoutes";
  import productRoutes    from "@interfaces/routes/productRoutes";
  import collectionRoutes from "@interfaces/routes/collectionRoutes";
  import orderRoutes      from "@interfaces/routes/orderRoutes";
  import { setupSwagger } from "./swagger";

  const app  = express();
  const PORT = process.env.PORT ?? 4000;

  // ── Middlewares globales ─────────────────────────────────────────────────────
  const allowedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:3000",
  "http://localhost:3000",
  "https://glow-cart-zeta.vercel.app",
  "https://glow-cart-git-main-violg0s-projects.vercel.app",
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  }
}));
  app.use(express.json());
  app.use(logger);

  // ── Swagger ──────────────────────────────────────────────────────────────────
  setupSwagger(app);

  // ── Rutas ────────────────────────────────────────────────────────────────────
  app.use("/api/v1/auth",        authRoutes);
  app.use("/api/v1/products",    productRoutes);
  app.use("/api/v1/collections", collectionRoutes);
  app.use("/api/v1/orders",      orderRoutes);

  // Health check
  app.get("/api/health", (_, res) => res.json({ status: "ok", timestamp: new Date() }));

  // ── Error handler (siempre al final) ────────────────────────────────────────
  app.use(errorHandler);

  // ── Servidor ─────────────────────────────────────────────────────────────────
  app.listen(PORT, () => {
    console.log(`🚀 Glow Cart API corriendo en http://localhost:${PORT}`);
  });
