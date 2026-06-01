import { Product, CreateProductDTO, UpdateProductDTO } from "@domain/entities/Product";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IProductRepository {
  findAll(pagination?: PaginationParams): Promise<PaginatedResult<Product>>;
  findById(id: string): Promise<Product | null>;
  findByCategory(slug: string, pagination?: PaginationParams): Promise<PaginatedResult<Product>>;
  findByCollection(slug: string, pagination?: PaginationParams): Promise<PaginatedResult<Product>>;
  create(data: CreateProductDTO): Promise<Product>;
  update(id: string, data: UpdateProductDTO): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

