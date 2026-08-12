import { describe, expect, it } from "vitest";
import { pickLocale } from "../src/lib/locale";

describe("pickLocale", () => {
  it("defaults to Dutch when nothing is known", () => {
    expect(pickLocale(null)).toBe("nl");
    expect(pickLocale(undefined)).toBe("nl");
    expect(pickLocale("")).toBe("nl");
    expect(pickLocale("   ")).toBe("nl");
  });

  it("serves Dutch to Dutch browsers", () => {
    expect(pickLocale("nl")).toBe("nl");
    expect(pickLocale("nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7")).toBe("nl");
    expect(pickLocale("nl-BE")).toBe("nl");
  });

  it("serves English to English browsers", () => {
    expect(pickLocale("en-US,en;q=0.9")).toBe("en");
    expect(pickLocale("en-GB")).toBe("en");
  });

  it("serves English to browsers preferring another known language", () => {
    expect(pickLocale("de-DE,de;q=0.9")).toBe("en");
    expect(pickLocale("fr-FR,fr;q=0.9,es;q=0.8")).toBe("en");
  });

  it("respects quality ordering", () => {
    expect(pickLocale("en;q=0.8,nl;q=0.9")).toBe("nl");
    expect(pickLocale("de;q=1,nl;q=0.5")).toBe("nl");
    expect(pickLocale("de;q=1,en;q=0.5")).toBe("en");
  });

  it("treats a wildcard as no preference (Dutch default)", () => {
    expect(pickLocale("*")).toBe("nl");
  });

  it("lets an explicit cookie choice win over the browser language", () => {
    expect(pickLocale("nl-NL,nl;q=0.9", "en")).toBe("en");
    expect(pickLocale("en-US", "nl")).toBe("nl");
  });

  it("ignores invalid cookies", () => {
    expect(pickLocale("en-US", "de")).toBe("en");
    expect(pickLocale(null, "garbage")).toBe("nl");
  });
});
