// Exports the site's graphic language as standalone files, straight from the source:
//   pixel icons + cursor + item sprites  ← assets/js/main.js (PX, arrow, ITEMS, ITEM_COLORS)
//   tokens.json                          ← design-system/tokens.css
// Run after changing an icon or a token:  node design-system/tools/build-assets.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const OUT = join(ROOT, 'design-system', 'assets');
const js = readFileSync(join(ROOT, 'assets/js/main.js'), 'utf8');
const css = readFileSync(join(ROOT, 'design-system/tokens.css'), 'utf8');

// pull a literal out of main.js by its opening text and closing token
const literal = (open, close) => {
  const i = js.indexOf(open);
  if (i < 0) throw new Error(`not found in main.js: ${open}`);
  const start = i + open.length - 1;              // keep the opening bracket
  const end = js.indexOf(close, start) + close.length - 1;   // drop the trailing ;
  return Function(`return (${js.slice(start, end)})`)();
};
const PX = literal('const PX = {', '\n  };');
const ARROW = literal('const arrow = [', '\n    ];');
const ITEM_COLORS = literal('const ITEM_COLORS = {', '\n  };');
const ITEMS = literal('const ITEMS = [', '\n  ];');
const FACT_SPRITES = literal('const FACT_SPRITES = {', '\n  };');

const PINK = '#FF7BF8', BG = '#0B0408', PAPER = '#F6EFF2';

// same algorithm as pxSVG() in main.js: one path per colour, runs merged per row
function pxSVG(rows, colors, scale = 8, title = '') {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const paths = {};
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length;) {
      const ch = row[x];
      if (colors[ch]) {
        let n = 1;
        while (row[x + n] === ch) n++;
        (paths[ch] = paths[ch] || []).push(`M${x} ${y}h${n}v1h-${n}z`);
        x += n;
      } else x++;
    }
  });
  const body = Object.entries(paths).map(([ch, d]) => `<path fill="${colors[ch]}" d="${d.join('')}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * scale}" height="${h * scale}" shape-rendering="crispEdges">${title ? `<title>${title}</title>` : ''}${body}</svg>\n`;
}

// item sprites get the same 1px soft-pink outline as itemSprite() in main.js
function outlined(rows) {
  const w = rows[0].length, h = rows.length;
  const solid = (x, y) => rows[y] && rows[y][x] && rows[y][x] !== '.' && rows[y][x] !== 's';
  const grid = Array.from({ length: h + 2 }, () => Array(w + 2).fill('.'));
  rows.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== '.') grid[y + 1][x + 1] = ch; }));
  for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
    if (solid(x, y) || (rows[y] && rows[y][x] === 's')) continue;
    if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) grid[y + 1][x + 1] = '~';
  }
  return grid.map(r => r.join(''));
}

const write = (rel, data) => {
  const f = join(OUT, rel);
  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, data);
  return rel;
};
const made = [];

// 1. pixel icons: pink (for night backgrounds) and ink (for pink / paper backgrounds)
for (const [name, rows] of Object.entries(PX)) {
  made.push(write(`icons/${name}.svg`, pxSVG(rows, { '#': PINK }, 8, name)));
  made.push(write(`icons/ink/${name}.svg`, pxSVG(rows, { '#': BG }, 8, name)));
}

// 2. the cursor, exactly as the site draws it (2× = the on-screen size)
made.push(write('cursor/cursor.svg', pxSVG(ARROW, { '#': PINK, o: BG }, 2, 'cursor')));
made.push(write('cursor/cursor-hover.svg', pxSVG(ARROW, { '#': BG, o: PINK }, 2, 'cursor — hover')));
made.push(write('cursor/cursor@8x.svg', pxSVG(ARROW, { '#': PINK, o: BG }, 8, 'cursor (large, for posts)')));

// 3. Shiran's things (hero game + fun facts)
const spriteColors = { ...ITEM_COLORS, '~': 'rgba(255,123,248,.55)' };
for (const it of ITEMS) made.push(write(`sprites/${it.id}.svg`, pxSVG(outlined(it.rows), spriteColors, 8, it.label)));
made.push(write('sprites/clapper.svg', pxSVG(outlined(FACT_SPRITES.clapper), spriteColors, 8, 'clapperboard')));

// 4. vector graphics
const sparkle = 'M50 0L52.3 44.5L69.8 30.2L55.5 47.7L100 50L55.5 52.3L69.8 69.8L52.3 55.5L50 100L47.7 55.5L30.2 69.8L44.5 52.3L0 50L44.5 47.7L30.2 30.2L47.7 44.5Z';
made.push(write('graphics/sparkle.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><title>sparkle</title><path fill="${PINK}" d="${sparkle}"/></svg>\n`));
made.push(write('graphics/sparkle-sticker.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 108 108" width="216" height="216"><title>sparkle — collage sticker</title><path fill="${PAPER}" stroke="${PINK}" stroke-width="2.5" stroke-linejoin="round" d="${sparkle}"/></svg>\n`));
const burst = [[50, 0], [59, 15], [75, 7], [76, 24], [93, 25], [85, 41], [100, 50], [85, 59], [93, 75], [76, 76], [75, 93], [59, 85], [50, 100], [41, 85], [25, 93], [24, 76], [7, 75], [15, 59], [0, 50], [15, 41], [7, 25], [24, 24], [25, 7], [41, 15]];
made.push(write('graphics/burst.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="200" height="200"><title>burst sticker</title><polygon fill="${PINK}" points="${burst.map(p => p.join(',')).join(' ')}"/></svg>\n`));
made.push(write('graphics/pixel-spark.svg', pxSVG(PX.spark, { '#': PINK }, 16, 'pixel spark (marquee / bullets)')));
made.push(write('graphics/dot-grid-tile.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><title>dot matrix tile (8px)</title><rect x="3.25" y="3.25" width="1.5" height="1.5" fill="${PINK}" fill-opacity=".07"/></svg>\n`));
made.push(write('graphics/dot-grid-strong-tile.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><title>card-screen dots (8px)</title><circle cx="4" cy="4" r="1" fill="${PINK}" fill-opacity=".2"/></svg>\n`));
made.push(write('graphics/scanlines-tile.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"><title>CRT scanline tile</title><rect y="2" width="4" height="1" fill="#000" fill-opacity=".16"/></svg>\n`));
made.push(write('graphics/grain.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><title>paper grain</title><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .45 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>\n`));
made.push(write('graphics/frame-corners.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><title>frame corners</title><path fill="none" stroke="${PINK}" stroke-width="2" d="M1 19V1h18M181 1h18v18M199 181v18h-18M19 199H1v-18"/></svg>\n`));
made.push(write('graphics/dashed-rule.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="2"><title>dashed rule tile</title><rect width="4" height="2" fill="${PINK}" fill-opacity=".45"/></svg>\n`));

// 5. tokens.json — every custom property in tokens.css, for Figma / Canva / social tools
const tokens = {};
for (const [, name, value] of css.matchAll(/--([\w-]+):\s*([^;]+);/g)) tokens[name] = value.trim().replace(/\s+/g, ' ');
writeFileSync(join(ROOT, 'design-system', 'tokens.json'), JSON.stringify({ $source: 'design-system/tokens.css', ...tokens }, null, 2) + '\n');

console.log(`wrote ${made.length} assets + tokens.json (${Object.keys(tokens).length} tokens)`);
