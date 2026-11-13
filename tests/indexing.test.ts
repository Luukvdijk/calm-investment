import { afterEach, describe, expect, it, vi } from "vitest";

async function laad(appUrl?: string) {
  vi.resetModules();
  if (appUrl === undefined) {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", appUrl);
  }
  return import("../src/lib/indexing");
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("magGeindexeerd", () => {
  it("staat alleen het echte domein toe", async () => {
    const { magGeindexeerd } = await laad("https://www.calminvestments.com");
    expect(magGeindexeerd("www.calminvestments.com")).toBe(true);
    expect(magGeindexeerd("calminvestments.com")).toBe(true);
    expect(magGeindexeerd("WWW.CalmInvestments.com")).toBe(true);
    expect(magGeindexeerd("www.calminvestments.com:443")).toBe(true);
  });

  it("weigert previewomgevingen", async () => {
    const { magGeindexeerd } = await laad("https://www.calminvestments.com");
    expect(magGeindexeerd("calminvestment.luukvandijk.com")).toBe(false);
    expect(magGeindexeerd("calm-investment.vercel.app")).toBe(false);
    expect(magGeindexeerd("calm-investment-git-dev.vercel.app")).toBe(false);
    expect(magGeindexeerd("localhost:3010")).toBe(false);
  });

  it("weigert een ontbrekende host", async () => {
    const { magGeindexeerd } = await laad("https://www.calminvestments.com");
    expect(magGeindexeerd(null)).toBe(false);
    expect(magGeindexeerd(undefined)).toBe(false);
    expect(magGeindexeerd("")).toBe(false);
  });

  it("valt terug op het standaarddomein als de variabele ontbreekt", async () => {
    const { magGeindexeerd } = await laad();
    expect(magGeindexeerd("calminvestments.com")).toBe(true);
    expect(magGeindexeerd("calminvestment.luukvandijk.com")).toBe(false);
  });
});
