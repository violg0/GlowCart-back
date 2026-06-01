import { Admin } from "@domain/entities/Admin";

export interface CreateAdminDTO {
  email: string;
  passwordHash: string;
  role?: "superadmin" | "admin";
}

export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<Admin | null>;
  create(data: CreateAdminDTO): Promise<Admin>;
}