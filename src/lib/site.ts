const STANDAARD_URL = "https://calminvestments.com";

/**
 * Een in Vercel aangemaakte maar leeg gelaten variabele levert een lege
 * string op, niet undefined. Zonder deze check zouden sitemap, canonical
 * en de OG-afbeeldingen een ongeldige URL krijgen.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "") || STANDAARD_URL;

/** hreflang alternates for a path like "/portfolio" ("" for home). */
export function languageAlternates(path: string) {
  return {
    languages: {
      nl: `${siteUrl}/nl${path}`,
      en: `${siteUrl}/en${path}`,
      "x-default": `${siteUrl}/nl${path}`,
    },
  };
}
