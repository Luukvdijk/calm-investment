import { siteUrl } from "./site";

/** Host zonder poort en zonder leidende "www.", zodat www en apex gelijk zijn. */
function normaliseer(host: string): string {
  return host.toLowerCase().split(":")[0].replace(/^www\./, "");
}

/**
 * Alleen het echte domein mag in Google. Previewomgevingen draaien dezelfde
 * build, dus het onderscheid moet per verzoek op de host, niet op een
 * build-variabele. Zo blijven calminvestment.luukvandijk.com en de
 * *.vercel.app-adressen vanzelf buiten de zoekresultaten.
 */
export function magGeindexeerd(host: string | null | undefined): boolean {
  if (!host) return false;
  let canoniek: string;
  try {
    canoniek = new URL(siteUrl).host;
  } catch {
    return false;
  }
  return normaliseer(host) === normaliseer(canoniek);
}

export const NOINDEX_HEADER = "noindex, nofollow";
