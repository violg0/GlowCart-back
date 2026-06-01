import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "@infrastructure/auth/jwt";

declare global {
  namespace Express {
    interface Request { admin?: { adminId: string; email: string; role: string };
   }
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
      return res.status(401).json({ message: "Token requerido" });

    const token = auth.split(" ")[1];
    const payload = verifyToken(token);
    req.admin = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  requireAdmin(req, res, () => {
    if (req.admin?.role !== "superadmin")
      return res.status(403).json({ message: "Se requiere rol superadmin" });
    next();
  });
}