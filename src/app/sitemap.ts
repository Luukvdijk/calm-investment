import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

/**
 * Alleen pagina's die ook echt geïndexeerd mogen worden. Privacy en
 * voorwaarden staan op `robots: { index: false }`, dus die hier opnemen is
 * een tegenstrijdig signaal: de sitemap vraagt om indexering en de pagina
 * weigert hem. Google rapporteert ze dan als "uitgesloten door noindex",
 * wat op een fout lijkt terwijl het precies de bedoeling is.
 */
const INDEXEERBARE_PADEN = ["", "/portfolio"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = INDEXEERBARE_PADEN;
  const lastModified = new Date();

  return locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.6,
    }))
  );
}
