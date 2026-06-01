import { IProductRepository, PaginationParams } from "@domain/repositories/IProductRepository";
import { CreateProductDTO, UpdateProductDTO } from "@domain/entities/Product";

export class GetAllProducts {
  constructor(private repo: IProductRepository) {}
  execute(pagination?: PaginationParams) { return this.repo.findAll(pagination); }
}

export class GetProductById {
  constructor(private repo: IProductRepository) {}
  async execute(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }
}

export class CreateProduct {
  constructor(private repo: IProductRepository) {}
  execute(data: CreateProductDTO) { return this.repo.create(data); }
}

export class UpdateProduct {
  constructor(private repo: IProductRepository) {}
  async execute(id: string, data: UpdateProductDTO) {
    const product = await this.repo.update(id, data);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }
}

export class DeleteProduct {
  constructor(private repo: IProductRepository) {}
  async execute(id: string) {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new Error("Producto no encontrado");
  }
}
