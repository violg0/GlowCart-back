import { Collection, CreateCollectionDTO, UpdateCollectionDTO } from "@domain/entities/Collection";

export interface ICollectionRepository {
  findAll(): Promise<Collection[]>;
  findBySlug(slug: string): Promise<Collection | null>;
  create(data: CreateCollectionDTO): Promise<Collection>;
  update(slug: string, data: UpdateCollectionDTO): Promise<Collection | null>;
}
