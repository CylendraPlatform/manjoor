import { useEffect } from "react";
import { brand } from "@/config/brand";

interface SeoProps {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * Client-side SEO head manager. NOTE: this app is a Vite client-rendered SPA,
 * so crawlers that do not execute JS may not see these tags. See
 * docs/phase-02/SEO_PLAN.md for the documented limitation and the sitemap/robots
 * baseline that compensate.
 */
export default function Seo({ title, description, path, image }: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${brand.ar} ${brand.en}`;
    document.title = fullTitle;
    if (description) upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", fullTitle);
    if (description) upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", "ar_IQ");
    upsertMeta("name", "robots", import.meta.env.VITE_ALLOW_INDEXING === "true" ? "index,follow" : "noindex,nofollow");
    if (image) upsertMeta("property", "og:image", image);
    if (path && typeof window !== "undefined") {
      upsertLink("canonical", window.location.origin + path);
    }
  }, [title, description, path, image]);
  return null;
}
