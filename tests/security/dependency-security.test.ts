// Regression test for the Aikido / npm audit dependency findings of 2026-11-21.
//
// Each rule below is one advisory. The test fails if ANY copy of the package
// in package-lock.json (top-level or nested under another package) is still in
// the vulnerable range. Aikido scans package-lock.json, so that is the file
// checked here; direct dependencies are also checked in node_modules (what
// actually runs).
//
// Findings covered:
// - next < 16.4.5: 78 CVEs incl. RCE via unsafe deserialization (Aikido, critical)
// - sharp < 0.35.5: heap overflow in bundled librsvg/libheif/libvips (via next, high)
// - postcss <= 8.5.22: XSS and file read via source maps (via next, high)
// - zod < 4.6.6: memory exhaustion on oversized collections (npm audit, high)
// - source-map-js 1.0.0 to 1.2.1: event-loop DoS (npm audit, high)
// - vitest 2.1.0 to 4.1.10 and its tinypool <= 2.1.1: dev server and worker issues (npm audit, critical)
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = path.resolve(__dirname, "../..");

type Rule = {
  name: string;
  /** First patched version. */
  minimum: string;
  /** Only versions at or above this are affected (older major lines may be safe). */
  affectedFrom?: string;
  /** Also check the installed copy in node_modules (direct dependencies). */
  direct?: boolean;
};

const RULES: Rule[] = [
  { name: "next", minimum: "16.4.5", direct: true },
  { name: "sharp", minimum: "0.35.5" },
  { name: "postcss", minimum: "8.5.23" },
  { name: "zod", minimum: "4.6.6" },
  { name: "source-map-js", minimum: "1.2.2", affectedFrom: "1.0.0" },
  { name: "vitest", minimum: "4.1.11", affectedFrom: "2.1.0", direct: true },
  { name: "tinypool", minimum: "2.1.2" },
];

/** Packages with no patched release: they must not be installed at all. */
const BANNED: string[] = [];

function parse(version: string): number[] {
  const core = version.split(/[-+]/)[0];
  return core.split(".").map((part) => Number.parseInt(part, 10) || 0);
}

function isAtLeast(version: string, minimum: string): boolean {
  const a = parse(version);
  const b = parse(minimum);
  for (let i = 0; i < 3; i++) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return true;
}

function isVulnerable(version: string, rule: Rule): boolean {
  if (rule.affectedFrom && !isAtLeast(version, rule.affectedFrom)) return false;
  return !isAtLeast(version, rule.minimum);
}

function readJson(file: string): Record<string, unknown> {
  return JSON.parse(readFileSync(file, "utf8"));
}

const lock = readJson(path.join(ROOT, "package-lock.json")) as {
  packages: Record<string, { version?: string }>;
};

/** Every lockfile entry for a package: "node_modules/x" and "node_modules/a/node_modules/x". */
function lockEntries(name: string): { at: string; version: string }[] {
  const suffix = `node_modules/${name}`;
  return Object.entries(lock.packages)
    .filter(([key, meta]) => (key === suffix || key.endsWith(`/${suffix}`)) && meta.version)
    .map(([key, meta]) => ({ at: key, version: meta.version! }));
}

describe("isAtLeast", () => {
  it("compares semver cores", () => {
    expect(isAtLeast("16.4.5", "16.4.5")).toBe(true);
    expect(isAtLeast("16.4.6", "16.4.5")).toBe(true);
    expect(isAtLeast("16.10.0", "16.4.5")).toBe(true);
    expect(isAtLeast("16.2.9", "16.4.5")).toBe(false);
    expect(isAtLeast("10.57.0", "10.75.2")).toBe(false);
  });

  it("only flags versions inside the affected range", () => {
    const rule: Rule = { name: "x", minimum: "11.0.1", affectedFrom: "7.0.0" };
    expect(isVulnerable("3.1.5", rule)).toBe(false);
    expect(isVulnerable("10.2.6", rule)).toBe(true);
    expect(isVulnerable("11.0.5", rule)).toBe(false);
  });
});

describe("vulnerable dependency versions", () => {
  for (const rule of RULES) {
    it(`package-lock.json has no ${rule.name} below ${rule.minimum}`, () => {
      const bad = lockEntries(rule.name)
        .filter((e) => isVulnerable(e.version, rule))
        .map((e) => `${e.at}@${e.version}`);
      expect(bad, `vulnerable ${rule.name}, need >= ${rule.minimum}`).toEqual([]);
    });

    if (rule.direct) {
      it(`installed ${rule.name} >= ${rule.minimum}`, () => {
        const installed = readJson(path.join(ROOT, "node_modules", rule.name, "package.json"))
          .version as string;
        expect(
          isVulnerable(installed, rule),
          `installed ${rule.name} ${installed} is vulnerable, need >= ${rule.minimum}`
        ).toBe(false);
      });
    }
  }

  for (const name of BANNED) {
    it(`package-lock.json does not contain ${name} (no patched release)`, () => {
      expect(lockEntries(name).map((e) => `${e.at}@${e.version}`)).toEqual([]);
    });
  }
});
