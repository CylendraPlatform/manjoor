/**
 * Which surface a URL belongs to. Marketing and checkout are gated separately
 * so a brochure site can exist while direct purchase stays off.
 */
export const MARKETING_EXACT_PATHS = [
  "/",
  "/products",
  "/wholesale",
  "/custom-orders",
  "/about",
  "/contact",
  "/request-quote",
  "/privacy",
] as const;

const CHECKOUT_PREFIXES = [
  "/checkout",
  "/cart",
  "/thank-you",
  "/offers",
  "/wishlist",
  "/track-order",
  "/auth",
  "/profile",
  "/support",
  "/agent",
];

export type Surface = "marketing" | "checkout" | "admin" | "unknown";

export function classifyPath(pathname: string): Surface {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "admin";
  if ((MARKETING_EXACT_PATHS as readonly string[]).includes(pathname)) return "marketing";
  if (
    pathname.startsWith("/products/") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/category/")
  ) {
    return "marketing";
  }
  if (CHECKOUT_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return "checkout";
  }
  return "unknown";
}

export function isSurfaceEnabled(
  surface: Surface,
  flags: { publicSite: boolean; directCheckout: boolean },
): boolean {
  if (surface === "admin") return true;
  if (surface === "marketing") return flags.publicSite;
  if (surface === "checkout") return flags.directCheckout;
  return false;
}
