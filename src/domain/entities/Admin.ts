export type AdminRole = "superadmin" | "admin";

export interface Admin {
  id: string;
  email: string;
  passwordHash: string;
  role: AdminRole;
  createdAt: Date;
}