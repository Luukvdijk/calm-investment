import { defaultLocale, isLocale, type Locale } from "./i18n";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/**
 * Picks the locale for a visitor without one in the URL.
 * Priority: explicit cookie choice > Accept-Language > Dutch default.
 * Visitors whose browser prefers neither nl nor en get English;
 * only when we know nothing at all do we fall back to Dutch.
 */
export function pickLocale(
  acceptLanguage: string | null | undefined,
  cookie?: string | null
): Locale {
  if (cookie && isLocale(cookie)) return cookie;
  if (!acceptLanguage || !acceptLanguage.trim()) return defaultLocale;

  const prefs = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const q = qParam ? parseFloat(qParam.split("=")[1]) : 1;
      return { tag: tag.trim().toLowerCase(), q: Number.isNaN(q) ? 0 : q };
    })
    .filter((p) => p.tag)
    .sort((a, b) => b.q - a.q);

  if (prefs.length === 0) return defaultLocale;

  for (const { tag } of prefs) {
    if (tag === "*") return defaultLocale;
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }

  // Browser states a clear preference, but not for nl or en: serve English.
  return "en";
}
