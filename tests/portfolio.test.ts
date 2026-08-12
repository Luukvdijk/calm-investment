import { describe, expect, it } from "vitest";
import { existsSync } from "fs";
import path from "path";
import { getFeaturedItems, getPortfolioItems } from "../src/lib/portfolio";

describe("portfolio content", () => {
  it("every item has the required fields", () => {
    for (const item of getPortfolioItems()) {
      expect(item.id).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(["active", "exit"]).toContain(item.status);
      expect(item.image).toMatch(/^\//);
    }
  });

  it("item ids are unique", () => {
    const ids = getPortfolioItems().map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("homepage shows at most 3 featured items", () => {
    const featured = getFeaturedItems();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.length).toBeLessThanOrEqual(3);
    expect(featured.every((i) => i.featured)).toBe(true);
  });

  it("referenced local images exist in /public", () => {
    for (const item of getPortfolioItems()) {
      if (item.image.startsWith("/")) {
        const file = path.join(__dirname, "..", "public", item.image);
        expect(existsSync(file), `${item.image} missing`).toBe(true);
      }
    }
  });
});
