import { supabase } from "@infrastructure/database/supabaseClient";
import { ICollectionRepository } from "@domain/repositories/ICollectionRepository";
import { Collection, CreateCollectionDTO, UpdateCollectionDTO } from "@domain/entities/Collection";

export class SupabaseCollectionRepository implements ICollectionRepository {

  private map(row: any): Collection {
    return {
      id:          row.id,
      name:        row.name,
      slug:        row.slug,
      description: row.description,
      coverImage:  row.cover_image,
      bannerImage: row.banner_image,
      palette:     row.palette,
      createdAt:   new Date(row.created_at),
    };
  }

  async findAll(): Promise<Collection[]> {
    const { data, error } = await supabase.from("collections").select("*");
    if (error) throw new Error(error.message);
    return (data ?? []).map(this.map);
  }

  async findBySlug(slug: string): Promise<Collection | null> {
    const { data, error } = await supabase
      .from("collections").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return this.map(data);
  }

  async create(dto: CreateCollectionDTO): Promise<Collection> {
    const { data, error } = await supabase
      .from("collections")
      .insert({
        name:         dto.name,
        slug:         dto.slug,
        description:  dto.description,
        cover_image:  dto.coverImage,
        banner_image: dto.bannerImage,
        palette:      dto.palette,
      })
      .select().single();
    if (error) throw new Error(error.message);
    return this.map(data);
  }

  async update(slug: string, dto: UpdateCollectionDTO): Promise<Collection | null> {
    const updates: any = {};
    if (dto.name        !== undefined) updates.name         = dto.name;
    if (dto.description !== undefined) updates.description  = dto.description;
    if (dto.coverImage  !== undefined) updates.cover_image  = dto.coverImage;
    if (dto.bannerImage !== undefined) updates.banner_image = dto.bannerImage;
    if (dto.palette     !== undefined) updates.palette      = dto.palette;

    const { data, error } = await supabase
      .from("collections").update(updates).eq("slug", slug).select().single();
    if (error || !data) return null;
    return this.map(data);
  }
}
