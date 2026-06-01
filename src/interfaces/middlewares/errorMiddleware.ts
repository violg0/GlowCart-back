import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(`[ERROR] ${err.message}`);
  const status = err.message.includes("no encontrado") ? 404
               : err.message.includes("inválid")       ? 401
               : 500;
  res.status(status).json({ message: err.message });
}
