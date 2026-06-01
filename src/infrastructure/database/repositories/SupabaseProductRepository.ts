import { supabase } from "@infrastructure/database/supabaseClient";
import { IProductRepository, PaginationParams, PaginatedResult } from "@domain/repositories/IProductRepository";
import { Product, CreateProductDTO, UpdateProductDTO } from "@domain/entities/Product";

export class SupabaseProductRepository implements IProductRepository {

  private map(row: any): Product {
    return {
      id:             row.id,
      name:           row.name,
      price:          row.price,
      description:    row.description,
      image:          row.image,
      categorySlug:   row.category_slug,
      collectionSlug: row.collection_slug ?? null,
      stock:          row.stock,
      badge:          row.badge ?? null,
      isBestSeller:   row.is_best_seller ?? false,
      isNew:          row.is_new ?? false,
      createdAt:      new Date(row.created_at),
    };
  }

  private buildPaginated<T>(data: T[], total: number, p: PaginationParams): PaginatedResult<T> {
    return {
      data,
      meta: {
        page:       p.page,
        limit:      p.limit,
        total,
        totalPages: Math.ceil(total / p.limit),
      },
    };
  }

  async findAll(pagination?: PaginationParams): Promise<PaginatedResult<Product>> {
    const page  = pagination?.page  ?? 1;
    const limit = pagination?.limit ?? 20;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw new Error(error.message);
    console.log("PAGE BACKEND:", page, "FROM:", from, "TO:", to);
    return this.buildPaginated((data ?? []).map(this.map), count ?? 0, { page, limit });
  }

  async findByCategory(slug: string, pagination?: PaginationParams): Promise<PaginatedResult<Product>> {
    const page  = pagination?.page  ?? 1;
    const limit = pagination?.limit ?? 20;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("category_slug", slug)
      .range(from, to);

    if (error) throw new Error(error.message);
    return this.buildPaginated((data ?? []).map(this.map), count ?? 0, { page, limit });
  }

  async findByCollection(slug: string, pagination?: PaginationParams): Promise<PaginatedResult<Product>> {
    const page  = pagination?.page  ?? 1;
    const limit = pagination?.limit ?? 20;
    const from  = (page - 1) * limit;
    const to    = from + limit - 1;

    const { data, error, count } = await supabase
      .from("products")
      .select("*", { count: "exact" })
      .eq("collection_slug", slug)
      .range(from, to);

    if (error) throw new Error(error.message);
    return this.buildPaginated((data ?? []).map(this.map), count ?? 0, { page, limit });
  }

  async findById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products").select("*").eq("id", id).single();
    if (error || !data) return null;
    return this.map(data);
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name:            dto.name,
        price:           dto.price,
        description:     dto.description,
        image:           dto.image,
        category_slug:   dto.categorySlug,
        collection_slug: dto.collectionSlug ?? null,
        stock:           dto.stock,
        badge:           dto.badge ?? null,
        is_best_seller:  dto.isBestSeller ?? false,
        is_new:          dto.isNew ?? false,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return this.map(data);
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product | null> {
    const updates: any = {};
    if (dto.name           !== undefined) updates.name            = dto.name;
    if (dto.price          !== undefined) updates.price           = dto.price;
    if (dto.description    !== undefined) updates.description     = dto.description;
    if (dto.image          !== undefined) updates.image           = dto.image;
    if (dto.categorySlug   !== undefined) updates.category_slug   = dto.categorySlug;
    if (dto.collectionSlug !== undefined) updates.collection_slug = dto.collectionSlug;
    if (dto.stock          !== undefined) updates.stock           = dto.stock;
    if (dto.badge          !== undefined) updates.badge           = dto.badge;
    if (dto.isBestSeller   !== undefined) updates.is_best_seller  = dto.isBestSeller;
    if (dto.isNew          !== undefined) updates.is_new          = dto.isNew;

    const { data, error } = await supabase
      .from("products").update(updates).eq("id", id).select().single();
    if (error || !data) return null;
    return this.map(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    return !error;
  }
}