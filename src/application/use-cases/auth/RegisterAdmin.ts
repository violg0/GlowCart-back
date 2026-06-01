import bcrypt from "bcryptjs";
import { IAdminRepository } from "@domain/repositories/IAdminRepository";
import { signToken } from "@infrastructure/auth/jwt";
import { AdminRole } from "@domain/entities/Admin";

export class RegisterAdmin {
  constructor(private adminRepo: IAdminRepository) {}

  async execute(
    email: string,
    password: string,
    role: AdminRole = "admin"
  ): Promise<{ token: string; email: string; role: string }> {
    const existing = await this.adminRepo.findByEmail(email);
    if (existing) throw new Error("El email ya está registrado");

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = await this.adminRepo.create({ email, passwordHash, role });

    const token = signToken({ adminId: admin.id, email: admin.email, role: admin.role });
    return { token, email: admin.email, role: admin.role };
  }
}