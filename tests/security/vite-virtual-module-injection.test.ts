// @vitest-environment node
/**
 * Regression test for GHSA-p4f5-76q4-ffq7 (AIKIDO-2026-137384).
 *
 * The Vite dev server built its `__vite-browser-external:` virtual module by
 * pasting the module ID from the request URL into generated JavaScript without
 * escaping it. Anyone who could reach the dev server could request a crafted
 * `/@id/` URL and get Vite to serve (and trust) code of their choosing.
 *
 * This test starts a real Vite dev server, sends the crafted request, and runs
 * the returned module the way a browser would. On a vulnerable Vite the
 * injected expression executes; on a patched Vite it is treated as plain text.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer, type ViteDevServer } from "vite";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import type { AddressInfo } from "node:net";

const MARKER = "__viteInjectionPwned";

let server: ViteDevServer;
let baseUrl: string;
let root: string;

beforeAll(async () => {
  root = mkdtempSync(path.join(tmpdir(), "vite-injection-"));
  server = await createServer({
    root,
    configFile: false,
    logLevel: "silent",
    server: { port: 0, host: "127.0.0.1", strictPort: false },
    optimizeDeps: { noDiscovery: true, include: [] },
  });
  await server.listen();
  const { port } = server.httpServer!.address() as AddressInfo;
  baseUrl = `http://127.0.0.1:${port}`;
}, 30_000);

afterAll(async () => {
  await server?.close();
  rmSync(root, { recursive: true, force: true });
  delete (globalThis as Record<string, unknown>)[MARKER];
});

async function fetchVirtualModule(prefix: string, payload: string) {
  // Sent as-is: the attack relies on `$`, `{` and `}` reaching Vite unencoded.
  const res = await fetch(`${baseUrl}/@id/${prefix}:${payload}`);
  return { status: res.status, code: await res.text() };
}

/** Evaluate an ES module that only has `export default <expr>` and return the default export. */
function evaluateDefaultExport(code: string): unknown {
  const body = code.replace(/export default/, "return");
  return new Function(body)();
}

/**
 * Run a generated module's top-level code (neutralizing its `export default`)
 * so any smuggled expression would execute. The optional-peer-dep module ends
 * in a `throw`, which is expected and swallowed here.
 */
function runModuleBody(code: string): void {
  const body = code.replace(/export default/, "void");
  try {
    new Function(body)();
  } catch {
    // The generated module intentionally throws; we only care about side effects.
  }
}

describe("Vite dev server virtual module ID injection (GHSA-p4f5-76q4-ffq7)", () => {
  it("does not execute code smuggled in via a __vite-browser-external: ID", async () => {
    // Bracket notation, not `globalThis.${MARKER}`: a "." in the ID makes Vite
    // treat it as a file extension and 404 before the virtual module is built.
    const payload = `\${globalThis['${MARKER}']=1}`;
    const { status, code } = await fetchVirtualModule("__vite-browser-external", payload);
    expect(status).toBe(200);

    delete (globalThis as Record<string, unknown>)[MARKER];
    const mod = evaluateDefaultExport(code) as Record<string, unknown>;
    // Touching any property triggers the generated "externalized" error.
    expect(() => mod.anything).toThrow();

    expect((globalThis as Record<string, unknown>)[MARKER]).toBeUndefined();
  });

  it("does not execute code smuggled in via a __vite-optional-peer-dep: ID", async () => {
    const payload = `\${globalThis['${MARKER}']=1}`;
    const { code } = await fetchVirtualModule(
      "__vite-optional-peer-dep",
      `${payload}:parent:false`,
    );

    // Patched Vite puts the untrusted ID in a plain string literal, so the
    // `${...}` is inert text. Running the module must not trigger the payload:
    // a vulnerable Vite would evaluate it while building the thrown Error.
    delete (globalThis as Record<string, unknown>)[MARKER];
    runModuleBody(code);

    expect((globalThis as Record<string, unknown>)[MARKER]).toBeUndefined();
  });
});
