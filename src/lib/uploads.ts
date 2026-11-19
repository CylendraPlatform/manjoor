const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
export const MAX_REFERENCE_BYTES = 4 * 1024 * 1024;

export interface FileLike {
  type: string;
  size: number;
  name?: string;
}

/** Client-side check only. The file is not uploaded until a reviewed storage path exists. */
export function validateReferenceImage(file: FileLike): string | null {
  if (!ALLOWED.has(file.type)) return "الصورة يجب أن تكون JPG أو PNG أو WebP.";
  if (file.size <= 0 || file.size > MAX_REFERENCE_BYTES) return "حجم الصورة يجب ألا يتجاوز 4 ميغابايت.";
  return null;
}
