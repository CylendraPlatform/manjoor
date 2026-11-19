const claimed = new Map<string, number>();
const WINDOW_MS = 60_000;

export function submissionKey(parts: string[]): string {
  return parts.map((part) => part.trim()).join("|");
}

/** Returns duplicate when the same payload was claimed in the last minute. */
export function claimSubmission(key: string, now = Date.now()): "ok" | "duplicate" {
  const previous = claimed.get(key);
  if (previous !== undefined && now - previous < WINDOW_MS) return "duplicate";
  claimed.set(key, now);
  return "ok";
}

export function releaseSubmission(key: string): void {
  claimed.delete(key);
}

export function resetSubmissionGuard(): void {
  claimed.clear();
}
