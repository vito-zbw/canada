// Build + preview + axe-audit every route. Used by `npm run a11y` and CI.
//
// Spawns `astro preview` as a child process, polls until it's serving, then
// runs the same axe-core + jsdom audit as scripts/check-axe.ts against every
// page in the route table. Cleans up the preview server on exit. Exits 0 if
// all routes are violation-free, 1 if any route has violations, 2 on infra
// error (server failed to start, network failure, etc.).

import process from 'node:process';
import path from 'node:path';
import { spawn, type ChildProcess } from 'node:child_process';
import axeCore from 'axe-core';
// @ts-expect-error -- see scripts/check-axe.ts for the same suppression
import jsdom from 'jsdom';
const { JSDOM } = jsdom;

const HOST = '127.0.0.1';
const PORT = 4321;
const BASE = `http://${HOST}:${PORT}`;

const ROUTES: readonly string[] = [
  '/',
  '/pre-trip',
  '/legs/vancouver',
  '/legs/calgary',
  '/legs/banff',
  '/legs/jasper',
  '/legs/the-canadian',
  '/legs/winnipeg',
  '/legs/ottawa',
  '/legs/montreal',
  '/legs/quebec-city',
  '/legs/toronto',
  '/404',
];

async function waitForServer(timeoutMs = 30_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const r = await fetch(`${BASE}/`);
      if (r.status < 500) return;
    } catch {
      // not yet listening
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`preview server did not start within ${timeoutMs}ms`);
}

async function auditUrl(url: string): Promise<axeCore.Result[]> {
  const res = await fetch(url);
  if (res.status >= 500) throw new Error(`server error ${res.status} at ${url}`);
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
  return results.violations;
}

function printViolations(route: string, violations: axeCore.Result[]): void {
  process.stderr.write(`axe FAILED: ${route} — ${violations.length} violation(s):\n`);
  for (const v of violations) {
    process.stderr.write(`  [${v.impact}] ${v.id}: ${v.help}\n`);
    process.stderr.write(`    help: ${v.helpUrl}\n`);
    for (const node of v.nodes) {
      process.stderr.write(`    - ${node.target.join(' ')}\n`);
    }
  }
}

async function main(): Promise<number> {
  const astroBin = path.resolve('node_modules', '.bin', 'astro');
  const server: ChildProcess = spawn(
    astroBin,
    ['preview', '--host', HOST, '--port', String(PORT)],
    { stdio: ['ignore', 'pipe', 'pipe'] },
  );

  let serverOutput = '';
  server.stdout?.on('data', (chunk: Buffer) => {
    serverOutput += chunk.toString();
  });
  server.stderr?.on('data', (chunk: Buffer) => {
    serverOutput += chunk.toString();
  });

  let exitCode = 0;
  try {
    try {
      await waitForServer();
    } catch (err) {
      process.stderr.write(`astro preview output:\n${serverOutput}\n`);
      throw err;
    }

    let totalViolations = 0;
    let infraErrors = 0;
    for (const route of ROUTES) {
      const url = `${BASE}${route}`;
      try {
        const violations = await auditUrl(url);
        if (violations.length === 0) {
          process.stdout.write(`axe ok: ${route} — 0 violations\n`);
        } else {
          totalViolations += violations.length;
          printViolations(route, violations);
        }
      } catch (err) {
        infraErrors += 1;
        const msg = err instanceof Error ? err.message : String(err);
        process.stderr.write(`audit error on ${route}: ${msg}\n`);
      }
    }

    process.stdout.write(
      `\na11y summary: ${ROUTES.length} routes checked, ${totalViolations} violation(s)\n`,
    );
    if (totalViolations > 0) exitCode = 1;
    if (infraErrors > 0) exitCode = 2;
  } finally {
    server.kill('SIGTERM');
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!server.killed) server.kill('SIGKILL');
  }
  return exitCode;
}

main()
  .then((code) => process.exit(code))
  .catch((err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`run-a11y failed: ${msg}\n`);
    process.exit(2);
  });
