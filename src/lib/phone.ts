/**
 * Iraqi phone validation. Accepts local 07XXXXXXXXX (11 digits) or the +964
 * international form. Lightweight and deterministic — not a carrier check.
 */
export function isValidIraqiPhone(input: string): boolean {
  const cleaned = input.replace(/[\s-]/g, "");
  // 07 followed by 9 digits, OR +9647 / 009647 followed by 9 digits.
  return /^07\d{9}$/.test(cleaned) || /^(\+|00)?9647\d{9}$/.test(cleaned);
}

/** Normalizes an Iraqi phone to E.164 (+964...). Returns null if invalid. */
export function toIraqiE164(input: string): string | null {
  const cleaned = input.replace(/[\s-]/g, "");
  if (/^07\d{9}$/.test(cleaned)) return "+964" + cleaned.slice(1);
  const m = cleaned.match(/^(?:\+|00)?(9647\d{9})$/);
  if (m) return "+" + m[1];
  return null;
}
