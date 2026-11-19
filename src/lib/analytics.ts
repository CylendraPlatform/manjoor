/**
 * Lightweight, privacy-conscious conversion analytics.
 *
 * - No PII in event payloads or URLs (no names/phones).
 * - Campaign attribution (UTM + referrer + landing path) captured once per
 *   session and attached to events.
 * - Sink is pluggable: by default pushes to `window.dataLayer` when present and
 *   keeps an in-memory ring buffer (used by tests / a future reporting view).
 *   No third-party tracker is wired here.
 */
export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "product_inquiry_click"
  | "add_to_quote"
  | "quote_submission_success"
  | "whatsapp_click"
  | "wholesale_form_success"
  | "custom_order_request"
  | "concept_gallery_view"
  | "concept_inquiry_click"
  | "hero_cta_click"
  | "lead_qualified"
  | "lead_won";

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landing_path?: string;
  referrer?: string;
}

const ATTR_KEY = "manjoor-attribution";
const buffer: { event: AnalyticsEvent; props: Record<string, string | number>; ts: number }[] = [];

function safeGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* storage unavailable */ }
}

/** Captures campaign attribution once per browser session. Call on first load. */
export function captureAttribution(search: string, pathname: string, referrer: string): Attribution {
  const existing = safeGet(ATTR_KEY);
  if (existing) {
    try { return JSON.parse(existing) as Attribution; } catch { /* fall through */ }
  }
  const params = new URLSearchParams(search);
  const attr: Attribution = {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
    landing_path: pathname,
    referrer: referrer || undefined,
  };
  safeSet(ATTR_KEY, JSON.stringify(attr));
  return attr;
}

export function getAttribution(): Attribution {
  const existing = safeGet(ATTR_KEY);
  if (existing) {
    try { return JSON.parse(existing) as Attribution; } catch { /* ignore */ }
  }
  return {};
}

interface DataLayerWindow {
  dataLayer?: unknown[];
}

/** Records a conversion event. Props must NOT contain personal data. */
export function trackEvent(event: AnalyticsEvent, props: Record<string, string | number> = {}): void {
  const payload = { event, ...props, ...getAttribution(), ts: Date.now() };
  buffer.push({ event, props, ts: payload.ts });
  if (buffer.length > 200) buffer.shift();
  if (typeof window !== "undefined") {
    const w = window as DataLayerWindow;
    if (Array.isArray(w.dataLayer)) w.dataLayer.push(payload);
  }
}

/** Test/inspection helper. */
export function _getEventBuffer() {
  return [...buffer];
}
