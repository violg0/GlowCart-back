import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi    from "swagger-ui-express";
import { Express }  from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title:       "Glow Cart API",
      version:     "1.0.0",
      description: "Backend de Glow Cart — gestión de productos, colecciones y pedidos.",
    },
    servers: [{ url: "http://localhost:4000", description: "Desarrollo" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type:   "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Token JWT del administrador. Obtener en POST /api/auth/login",
        },
      },
    },
    tags: [
      { name: "Auth",        description: "Autenticación del administrador" },
      { name: "Products",    description: "Gestión de productos" },
      { name: "Collections", description: "Gestión de colecciones" },
      { name: "Orders",      description: "Gestión de pedidos" },
    ],
  },
  apis: ["./src/interfaces/routes/*.ts"],
};

export function setupSwagger(app: Express) {
  const spec = swaggerJsdoc(options);
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(spec, {
    customSiteTitle: "Glow Cart API Docs",
  }));
  console.log("📄 Swagger disponible en http://localhost:4000/api/docs");
}
