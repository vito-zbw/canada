// Run axe-core against a URL using jsdom — no Chromium required.
//
// Usage: node node_modules/.bin/tsx scripts/check-axe.ts http://localhost:4322/some-route
//
// Exits 0 with "no violations" if axe is clean, exits 1 and prints the
// violations otherwise. Used in place of @axe-core/cli, which depends on a
// browser binary we cannot install in the build sandbox.

import process from 'node:process';
import axeCore from 'axe-core';
// @ts-expect-error -- @types/jsdom is not installed in this repo; use the
// runtime API surface and let `astro check` see the file as opaque.
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

async function main(): Promise<void> {
  const url = process.argv[2];
  if (!url) {
    process.stderr.write('usage: check-axe.ts <url>\n');
    process.exit(2);
  }

  // Astro's 404 page is served with HTTP 404 by both dev and CF Pages; the
  // body is still valid HTML we want to audit. JSDOM.fromURL rejects non-2xx
  // responses, so fetch the markup manually and feed it to a fresh JSDOM.
  const res = await fetch(url);
  if (res.status >= 500) {
    process.stderr.write(`server error ${res.status} at ${url}\n`);
    process.exit(2);
  }
  const html = await res.text();
  const dom = new JSDOM(html, {
    url,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
  });

  const { window } = dom;
  window.eval(axeCore.source);

  const results = await (
    window as unknown as { axe: { run(opts: object): Promise<axeCore.AxeResults> } }
  ).axe.run({
    runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
  });

  if (results.violations.length === 0) {
    process.stdout.write(`axe ok: ${url} — 0 violations\n`);
    process.exit(0);
  }

  process.stderr.write(`axe FAILED: ${url} — ${results.violations.length} violation(s):\n`);
  for (const v of results.violations) {
    process.stderr.write(`\n  [${v.impact}] ${v.id}: ${v.help}\n`);
    process.stderr.write(`    help: ${v.helpUrl}\n`);
    for (const node of v.nodes) {
      process.stderr.write(`    - ${node.target.join(' ')}\n`);
      process.stderr.write(`      ${node.html.slice(0, 200)}\n`);
    }
  }
  process.exit(1);
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`check-axe failed: ${msg}\n`);
  process.exit(2);
});
