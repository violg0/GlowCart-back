import { Request, Response, NextFunction } from "express";
import { LoginAdmin } from "@application/use-cases/auth/LoginAdmin";
import { RegisterAdmin } from "@application/use-cases/auth/RegisterAdmin";
import { SupabaseAdminRepository } from "@infrastructure/database/repositories/SupabaseAdminRepository";

const repo    = new SupabaseAdminRepository();
const loginUC = new LoginAdmin(repo);
const registerUC = new RegisterAdmin(repo);

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "email y password son requeridos" });
      const result = await loginUC.execute(email, password);
      return res.status(200).json(result);
    } catch (e) { next(e); }
  },

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, role } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "email y password son requeridos" });
      if (password.length < 6)
        return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" });
      const result = await registerUC.execute(email, password, role);
      return res.status(201).json(result);
    } catch (e: any) {
      if (e.message === "El email ya está registrado")
        return res.status(409).json({ message: e.message });
      next(e);
    }
  },
 
  me(req: Request, res: Response) {
    return res.status(200).json({ admin: req.admin });
  },
};