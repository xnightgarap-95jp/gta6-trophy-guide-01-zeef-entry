// Leonida Ledger — a GTA 6 trophy guide and tracker (Node 22, standard
// library only). The guide itself is plain static files under app/: an
// index.html that opens in desktop Chrome and works with the network off,
// its modules, styles and data, and app/data/trophies.json with the official
// 55 trophies and a guide to each in our own words.
//
// This program hands the guide in: it copies app/ and screenshots/ from
// beside this file to /output and writes /output/dossier.json, the summary
// the judge reads (your screenshots, the first load's files and bytes, and
// your source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to
// be byte for byte what its own copy writes.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const appDir = join(here, 'app');
const shotsDir = join(here, 'screenshots');
if (!existsSync(appDir)) throw new Error('app/ is missing beside main.ts');
if (!existsSync(shotsDir)) throw new Error('screenshots/ is missing beside main.ts');

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes
// the bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in
// app/ or 48 MiB of app files: app/ counts beside /output's own 1000-entry
// cap, its screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
