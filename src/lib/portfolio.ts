import portfolioData from "@content/portfolio.json";
import type { Locale } from "./i18n";

export interface PortfolioItem {
  id: string;
  name: string;
  featured: boolean;
  status: "active" | "exit";
  image: string;
  website?: string;
  tags: Record<Locale, string[]>;
  summary: Record<Locale, string>;
}

export function getPortfolioItems(): PortfolioItem[] {
  return portfolioData.items as PortfolioItem[];
}

export function getFeaturedItems(limit = 3): PortfolioItem[] {
  return getPortfolioItems()
    .filter((item) => item.featured)
    .slice(0, limit);
}
