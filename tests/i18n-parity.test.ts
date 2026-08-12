import { describe, expect, it } from "vitest";
import nl from "../content/nl.json";
import en from "../content/en.json";
import portfolio from "../content/portfolio.json";

type Json = Record<string, unknown>;

function keyPaths(obj: unknown, prefix = ""): string[] {
  if (Array.isArray(obj)) {
    // Arrays may differ in length between languages only for plain string lists;
    // for object arrays we compare the structure of the first element.
    if (obj.length > 0 && typeof obj[0] === "object" && obj[0] !== null) {
      return keyPaths(obj[0], `${prefix}[]`);
    }
    return [`${prefix}[]`];
  }
  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj as Json).flatMap(([key, value]) =>
      keyPaths(value, prefix ? `${prefix}.${key}` : key)
    );
  }
  return [prefix];
}

function collectStrings(obj: unknown): string[] {
  if (typeof obj === "string") return [obj];
  if (Array.isArray(obj)) return obj.flatMap(collectStrings);
  if (typeof obj === "object" && obj !== null) {
    return Object.values(obj).flatMap(collectStrings);
  }
  return [];
}

describe("i18n content parity", () => {
  it("nl.json and en.json have an identical key structure", () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(nl).sort());
  });

  it("array sections have the same length in both languages", () => {
    expect(en.about.paragraphs).toHaveLength(nl.about.paragraphs.length);
    expect(en.about.stats).toHaveLength(nl.about.stats.length);
    expect(en.approach.pillars).toHaveLength(nl.approach.pillars.length);
    expect(en.focus.areas).toHaveLength(nl.focus.areas.length);
    expect(en.team.members).toHaveLength(nl.team.members.length);
    expect(en.footer.legal).toHaveLength(nl.footer.legal.length);
  });

  it("contains no empty strings", () => {
    for (const dict of [nl, en]) {
      for (const value of collectStrings(dict)) {
        expect(value.trim()).not.toBe("");
      }
    }
  });

  it("every portfolio item has both nl and en text", () => {
    for (const item of portfolio.items) {
      expect(item.summary.nl).toBeTruthy();
      expect(item.summary.en).toBeTruthy();
      expect(item.tags.nl.length).toBeGreaterThan(0);
      expect(item.tags.en.length).toBe(item.tags.nl.length);
    }
  });
});
