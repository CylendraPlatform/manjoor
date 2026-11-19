import { describe, expect, it } from "vitest";
import { filterCatalog, isRegulatedText, toPublicProduct, type PublicProduct } from "./public-catalog";

const categories = new Map([["c1", { name: "ديكور", slug: "decor" }]]);

function row(overrides: Record<string, unknown> = {}) {
  return {
    id: "11111111-1111-1111-1111-111111111111",
    slug: "box",
    name: "صندوق خشبي",
    is_active: true,
    public_approved: true,
    description: "صندوق",
    images: [],
    price: 1000,
    price_public: false,
    ...overrides,
  };
}

describe("public catalog visibility", () => {
  it("hides products that are not explicitly approved", () => {
    expect(toPublicProduct(row({ public_approved: false }), categories)).toBeNull();
    expect(toPublicProduct(row({ public_approved: undefined }), categories)).toBeNull();
  });

  it("hides regulated names even when approved", () => {
    expect(isRegulatedText("أركيلة خشب")).toBe(true);
    expect(isRegulatedText("بكار أراكيل خشبي")).toBe(true);
    expect(toPublicProduct(row({ name: "أركيلة خشب" }), categories)).toBeNull();
  });

  it("keeps an approved non-regulated product and hides an unapproved price", () => {
    const product = toPublicProduct(row(), categories);
    expect(product?.name).toBe("صندوق خشبي");
    expect(product?.pricePublic).toBe(false);
  });

  it("filters by search text", () => {
    const products = [
      toPublicProduct(row(), categories),
      toPublicProduct(row({
        id: "22222222-2222-2222-2222-222222222222",
        slug: "stand",
        name: "قاعدة",
      }), categories),
    ].filter((item): item is PublicProduct => item !== null);
    expect(filterCatalog(products, { search: "قاعدة" })).toHaveLength(1);
  });
});
