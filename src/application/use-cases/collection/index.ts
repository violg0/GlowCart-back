import { ICollectionRepository } from "@domain/repositories/ICollectionRepository";
import { CreateCollectionDTO, UpdateCollectionDTO } from "@domain/entities/Collection";

export class GetAllCollections {
  constructor(private repo: ICollectionRepository) {}
  execute() { return this.repo.findAll(); }
}

export class GetCollectionBySlug {
  constructor(private repo: ICollectionRepository) {}
  async execute(slug: string) {
    const col = await this.repo.findBySlug(slug);
    if (!col) throw new Error("Colección no encontrada");
    return col;
  }
}

export class CreateCollection {
  constructor(private repo: ICollectionRepository) {}
  execute(data: CreateCollectionDTO) { return this.repo.create(data); }
}

export class UpdateCollection {
  constructor(private repo: ICollectionRepository) {}
  async execute(slug: string, data: UpdateCollectionDTO) {
    const col = await this.repo.update(slug, data);
    if (!col) throw new Error("Colección no encontrada");
    return col;
  }
}
