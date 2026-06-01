import bcrypt from "bcryptjs";
import { IAdminRepository } from "@domain/repositories/IAdminRepository";
import { signToken } from "@infrastructure/auth/jwt";

export class LoginAdmin {
  constructor(private adminRepo: IAdminRepository) {}

  async execute(email: string, password: string): Promise<{ token: string; email: string; role: string }> {
    const admin = await this.adminRepo.findByEmail(email);
    if (!admin) throw new Error("Credenciales inválidas");

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new Error("Credenciales inválidas");

    const token = signToken({ adminId: admin.id, email: admin.email, role: admin.role });
    return { token, email: admin.email, role: admin.role };
  }
}