import { Product } from "@/types/product";

export interface ProductRow {
  id: string | number;
  name: string;
  price: number | string;
  category_id?: string | null;
  categoryId?: string | null;
  available?: boolean | null;
  image?: string | null;
}

export function mapProductRow(row: ProductRow): Product {
  const price = Number(row.price);

  if (!String(row.name).trim() || !Number.isFinite(price)) {
    throw new Error("Supabase returned a product with invalid name or price.");
  }

  return {
    id: String(row.id),
    name: row.name,
    price,
    categoryId: row.category_id ?? row.categoryId ?? "snacks",
    available: row.available ?? true,
    image: row.image ?? undefined,
  };
}
