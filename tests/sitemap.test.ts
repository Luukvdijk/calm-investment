import { describe, expect, it } from "vitest";
import sitemap from "../src/app/sitemap";
import { siteUrl } from "../src/lib/site";
import { locales } from "../src/lib/i18n";

/** Paden waarvan de pagina zelf `robots: { index: false }` zet. */
const NOINDEX_PADEN = ["/privacy", "/voorwaarden"];

describe("sitemap", () => {
  it("bevat geen pagina's die op noindex staan", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const pad of NOINDEX_PADEN) {
      const gevonden = urls.filter((url) => url.endsWith(pad));
      expect(
        gevonden,
        `${pad} staat op noindex en hoort niet in de sitemap`
      ).toEqual([]);
    }
  });

  it("bevat de home en portfolio in elke taal", () => {
    const urls = sitemap().map((entry) => entry.url);
    for (const locale of locales) {
      expect(urls).toContain(`${siteUrl}/${locale}`);
      expect(urls).toContain(`${siteUrl}/${locale}/portfolio`);
    }
    expect(urls).toHaveLength(locales.length * 2);
  });

  it("gebruikt overal dezelfde host als de canonical", () => {
    const canoniek = new URL(siteUrl).host;
    for (const entry of sitemap()) {
      expect(new URL(entry.url).host).toBe(canoniek);
    }
  });

  it("geeft de homepage de hoogste prioriteit", () => {
    for (const entry of sitemap()) {
      const isHome = locales.some((l) => entry.url === `${siteUrl}/${l}`);
      expect(entry.priority).toBe(isHome ? 1 : 0.6);
    }
  });
});
