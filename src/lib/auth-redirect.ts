/** Only allow same-origin path redirects (open-redirect safe). */
export function safeAuthRedirectPath(
  value: unknown,
  fallback: string,
): string {
  if (typeof value !== "string" || value.length === 0) {
    return fallback;
  }
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }
  return value;
}
