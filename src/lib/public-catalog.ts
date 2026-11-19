import { db } from "@/integrations/supabase/db";
import { getErrorMessage } from "@/lib/utils";
import { OFFERING_DIRECTIONS, type OfferingDirection } from "@/content/offerings";

const REGULATED = /أركيل|اركيل|شيش|نرجيل|hookah|shisha|tobacco|تبغ|معسل/i;

export interface PublicProduct {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  images: string[];
  price: number | null;
  pricePublic: boolean;
  stock: number | null;
  material: string | null;
  dimensions: string | null;
  finishes: string | null;
  moq: number | null;
  leadTime: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  createdAt: string | null;
}

export interface CatalogSnapshot {
  state: "ready" | "empty" | "unavailable";
  products: PublicProduct[];
  message: string;
}

export function isRegulatedText(...parts: Array<string | null | undefined>): boolean {
  return parts.some((part) => typeof part === "string" && REGULATED.test(part));
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function toPublicProduct(
  row: unknown,
  categories: ReadonlyMap<string, { name: string; slug: string }>,
): PublicProduct | null {
  if (!row || typeof row !== "object") return null;
  const record = row as Record<string, unknown>;
  if (typeof record.id !== "string" || typeof record.slug !== "string" || typeof record.name !== "string") {
    return null;
  }
  if (record.is_active === false) return null;
  if (record.public_approved !== true) return null;

  const categoryId = asString(record.category_id);
  const category = categoryId ? categories.get(categoryId) : undefined;
  const description = asString(record.description);
  if (isRegulatedText(record.name, description, category?.name, category?.slug)) return null;

  const images = Array.isArray(record.images)
    ? record.images.filter((item): item is string => typeof item === "string" && item.length > 0)
    : [];

  return {
    id: record.id,
    slug: record.slug,
    name: record.name,
    description,
    images,
    price: asNumber(record.price),
    pricePublic: record.price_public === true,
    stock: asNumber(record.stock),
    material: asString(record.material),
    dimensions: asString(record.dimensions) ?? asString(record.size),
    finishes: asString(record.finishes) ?? asString(record.finish),
    moq: asNumber(record.moq) ?? asNumber(record.min_order_qty),
    leadTime: asString(record.lead_time),
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    createdAt: asString(record.created_at),
  };
}

export function matchesOffering(product: PublicProduct, offering: OfferingDirection): boolean {
  const haystack = `${product.name} ${product.description ?? ""} ${product.categoryName ?? ""} ${product.categorySlug ?? ""}`;
  if (product.categorySlug === offering.slug) return true;
  return offering.keywords.some((keyword) => haystack.includes(keyword));
}

export function filterCatalog(
  products: PublicProduct[],
  options: { search?: string; category?: string; sort?: "name" | "newest" },
): PublicProduct[] {
  const search = options.search?.trim() ?? "";
  const offering = OFFERING_DIRECTIONS.find((item) => item.slug === options.category);
  const next = products.filter((product) => {
    if (offering && !matchesOffering(product, offering)) return false;
    if (!search) return true;
    const haystack = `${product.name} ${product.description ?? ""} ${product.material ?? ""}`;
    return haystack.includes(search);
  });
  return [...next].sort((a, b) => {
    if (options.sort === "newest") return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
    return a.name.localeCompare(b.name, "ar");
  });
}

async function loadCategories(): Promise<Map<string, { name: string; slug: string }>> {
  const categories = new Map<string, { name: string; slug: string }>();
  const { data, error } = await db.from("categories").select("id,name,slug");
  if (error || !Array.isArray(data)) return categories;
  for (const row of data) {
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    if (typeof record.id !== "string") continue;
    categories.set(record.id, {
      name: typeof record.name === "string" ? record.name : "",
      slug: typeof record.slug === "string" ? record.slug : "",
    });
  }
  return categories;
}

export async function loadPublicCatalog(): Promise<CatalogSnapshot> {
  try {
    const [productResult, categories] = await Promise.all([
      db.from("products").select("*").limit(200),
      loadCategories(),
    ]);
    if (productResult.error) {
      return { state: "unavailable", products: [], message: getErrorMessage(productResult.error) };
    }
    const products: PublicProduct[] = [];
    if (Array.isArray(productResult.data)) {
      for (const row of productResult.data) {
        const product = toPublicProduct(row, categories);
        if (product) products.push(product);
      }
    }
    if (products.length === 0) {
      return {
        state: "empty",
        products: [],
        message: "لا توجد منتجات معتمدة للعرض العام بعد. المنتجات القديمة لا تُنشر تلقائياً.",
      };
    }
    return { state: "ready", products, message: "" };
  } catch (error) {
    return { state: "unavailable", products: [], message: getErrorMessage(error) };
  }
}
