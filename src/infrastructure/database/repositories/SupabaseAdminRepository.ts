import { supabase } from "@infrastructure/database/supabaseClient";
import { IAdminRepository, CreateAdminDTO } from "@domain/repositories/IAdminRepository";
import { Admin } from "@domain/entities/Admin";

export class SupabaseAdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single();
    if (error || !data) return null;
    return this.map(data);
  }

  async findById(id: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return this.map(data);
  }

  async create(dto: CreateAdminDTO): Promise<Admin> {
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        email:         dto.email,
        password_hash: dto.passwordHash,
        role:          dto.role ?? "admin",
      })
      .select("*")
      .single();
    if (error || !data) throw new Error(error?.message ?? "Error al crear admin");
    return this.map(data);
  }

  private map(data: any): Admin {
    return {
      id:           data.id,
      email:        data.email,
      passwordHash: data.password_hash,
      role:         data.role ?? "admin",
      createdAt:    new Date(data.created_at),
    };
  }
}