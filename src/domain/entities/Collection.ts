export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  palette: string;
  createdAt: Date;
}

export type CreateCollectionDTO = Omit<Collection, "id" | "createdAt">;
export type UpdateCollectionDTO = Partial<CreateCollectionDTO>;
