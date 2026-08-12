export const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://calminvestments.com";

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
