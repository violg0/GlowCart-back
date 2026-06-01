export type CategorySlug =
  | "collares"
  | "aretes"
  | "anillos"
  | "pulseras"
  | "cabello"
  | "broches"
  | "llaveros";

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  categorySlug: CategorySlug;
  collectionSlug?: string | null;
  stock: number;
  badge?: string | null;
  isBestSeller?: boolean;
  isNew?: boolean;
  createdAt: Date;
}

export type CreateProductDTO = Omit<Product, "id" | "createdAt">;
export type UpdateProductDTO = Partial<CreateProductDTO>;
