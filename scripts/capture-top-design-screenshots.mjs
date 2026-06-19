import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2] || 'docs/site-detail-pass/top-design-engineer-latest';
await fs.mkdir(root, { recursive: true });

const routes = [
  ['home', '/'],
  ['map', '/map'],
  ['friend-finder', '/friend-finder'],
  ['van-intelligence', '/van-intelligence'],
  ['videos', '/videos'],
  ['news', '/news'],
  ['forum', '/forum'],
  ['marketplace', '/marketplace'],
  ['vendors', '/vendors'],
  ['gps', '/gps'],
  ['van-cards', '/van-cards'],
  ['auth', '/auth'],
  ['ai', '/ai'],
];

for (const [name, route] of routes) {
  for (const [label, viewport] of [
    ['desktop', '1440,1100'],
    ['mobile', '390,844'],
  ]) {
    const out = path.join(root, `${name}-${label}.png`);
    execFileSync('npx', [
      'playwright',
      'screenshot',
      '--full-page',
      `--viewport-size=${viewport}`,
      `http://127.0.0.1:5173${route}`,
      out,
    ], { stdio: 'inherit' });
  }
  console.log(`captured ${name}`);
}

console.log(root);
