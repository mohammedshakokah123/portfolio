# 02: الـ Sprites والأيقونات

## الهدف
كل رسمات التصميم (الشخصية، الجوهرة، الأشجار، الغيوم، الجبال، الأرض، الإطارات، والـ 31 أيقونة) بملف CSS واحد ثابت: `src/styles/pixel/sprites.generated.css`، **مطابق byte-by-byte** للي بيولّده سكربت الملف المرجعي بالمتصفح.

## الفكرة
المرجع بيرسم الـ sprites بالمتصفح: سكربت بالـ `<head>` فيه خرائط ASCII (كل حرف بكسل)، بيحوّلها لـ SVG data URIs وبيحطها كـ CSS variables (`--spr-*` و`--frame-*` و`--ico-*`) قبل أول paint.

منخلّي نفس الخرائط ونفس الخوارزمية، بس **منشغّلها وقت الـ build**:

```
src/pixel/sprites/*.ts  ─┐
src/pixel/scene.ts       ├─►  src/pixel/sheet.ts  ─►  scripts/build-sprites.mjs  ─►  sprites.generated.css
src/pixel/svg.ts        ─┘        buildSpriteCss()          (Node)                       (committed)
```

- Node (من 22.18، وعنا 24) بيستورد ملفات `.ts` مباشرة، فما في حزم جديدة.
- الملف المولّد **committed**: الـ build بيشتغل حتى لو المولّد ما اشتغل، والـ diff بيبيّن أي تغيير بالرسم.
- `npm run sprites:check` بيشغّل سكربت المرجع بالذاكرة وبيقارن الناتجين. هاد اللي بيضمن الـ "1:1".

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 47–218 `HERO_PAL` `HERO` `HEAD` | `src/pixel/sprites/hero.ts` |
| 219–427 `ART_PAL` `ART` | `src/pixel/sprites/art.ts` |
| 428–464 `SCENE_PAL` `GROUND` `DIRT` | `src/pixel/sprites/ground.ts` |
| 465–497 `ICONS` | `src/pixel/sprites/icons.ts` |
| 651–659 الإطارات (`F` والـ 8 خرائط) | `src/pixel/sprites/frames.ts` |
| 500–611 `grid` `rows` `rng` `disc` `clouds` `hills` `mountains` `skyline` `stars` | `src/pixel/scene.ts` |
| 614–631 `svg` `uri` `strip` | `src/pixel/svg.ts` |
| 633–671 الـ `add()` وترتيبها | `src/pixel/sheet.ts` |

## قواعد `src/pixel/**` (لأنه بيتشغّل بـ Node مباشرة)

1. الـ imports النسبية **مع الامتداد**: `import { svg } from "./svg.ts"`.
2. الأنواع بـ `import type` (أو `type` جوّا الأقواس). Node بيمسح الأنواع بس، وما بيعرف إنو الاسم نوع إلا إذا قلتله.
3. بدون `enum` أو `namespace` أو parameter properties.
4. بدون alias `@/`، وبدون أي import من برّا المجلد.

## الخطوات

### 1. `tsconfig.json`
ضيف جوّا `compilerOptions` (مسموح لأن `noEmit: true`):
```json
"allowImportingTsExtensions": true,
```

### 2. `src/pixel/svg.ts`
```ts
/** خريطة بكسلات: كل نص صف، وكل حرف بكسل. "." (أو مسافة) = شفاف */
export type PixelMap = readonly string[];

/** حرف ← لون */
export type Palette = Readonly<Record<string, string>>;

/**
 * خريطة ← SVG. كل مجموعة بكسلات متتالية بنفس اللون بنفس الصف بتصير مستطيل واحد (M x y h n v1 h-n z)،
 * وكل لون path واحد. ترتيب الـ paths = ترتيب أول ظهور لكل حرف بالخريطة.
 */
export function svg(map: PixelMap, pal: Palette): string {
  const h = map.length;
  const w = map[0].length;
  const paths: Record<string, string[]> = {};
  for (let y = 0; y < h; y++) {
    const row = map[y];
    let x = 0;
    while (x < w) {
      const c = row.charAt(x);
      if (c === "." || c === " ") {
        x++;
        continue;
      }
      let n = 1;
      while (x + n < w && row.charAt(x + n) === c) n++;
      (paths[c] ??= []).push(`M${x} ${y}h${n}v1h-${n}z`);
      x += n;
    }
  }
  let out = "";
  for (const [c, d] of Object.entries(paths)) out += `<path fill="${pal[c] ?? "#f0f"}" d="${d.join("")}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${out}</svg>`;
}

export function uri(svgText: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svgText)}")`;
}

/** frames جنب بعض بخريطة وحدة (sprite strip أفقي) */
export function strip(frames: readonly PixelMap[]): string[] {
  return frames[0].map((_, y) => frames.map((f) => f[y]).join(""));
}
```

### 3. خرائط الـ sprites: `src/pixel/sprites/`
**انقل الخرائط حرف بحرف** (copy/paste من المرجع). لا تعيد كتابتها بإيدك ولا ترتّبها.

#### `hero.ts` ← 47–218
```ts
import type { Palette, PixelMap } from "../svg.ts";

export const HERO_PAL: Palette = {
  // السطر 47 متل ما هو
};

/** 7 frames (16×22) بالترتيب: idle 1، idle 2، run 1، run 2، run 3، run 4، jump */
export const HERO: readonly PixelMap[] = [
  // الأسطر 49–216 متل ما هي
];

/** راس الشخصية (16×12): أفاتار الـ HUD، بديل الصورة الشخصية، وأيقونة الموقع */
export const HEAD: PixelMap = HERO[0].slice(1, 13);
```

#### `art.ts` ← 219–427
المرجع حاطط الجوهرة (4 frames) مع باقي الرسمات بـ object واحد. منفصلها مشان الأنواع تطلع بسيطة:
```ts
import type { Palette, PixelMap } from "../svg.ts";

export const ART_PAL: Palette = {
  // السطر 219 متل ما هو
};

/** 4 frames (10×9) لدوران الجوهرة */
export const GEM: readonly PixelMap[] = [
  // الأسطر 222–265 (الـ 4 مصفوفات اللي جوّا gem)
];

/** ⚠️ ترتيب المفاتيح = ترتيب الناتج. لازم يضل: block, sun, moon, tree, mailbox, flag, academy, office, diploma */
export const ART = {
  block: [
    // 268–283
  ],
  sun: [
    // 286–301
  ],
  moon: [
    // 304–319
  ],
  tree: [
    // 322–341
  ],
  mailbox: [
    // 344–359
  ],
  flag: [
    // 362–376
  ],
  academy: [
    // 379–394
  ],
  office: [
    // 397–412
  ],
  diploma: [
    // 415–425
  ],
} as const satisfies Record<string, PixelMap>;

export type ArtName = keyof typeof ART;
```

#### `ground.ts` ← 428–464
```ts
import type { Palette, PixelMap } from "../svg.ts";

/** ألوان الأرض والـ scenery المولّد (غيوم، تلال، جبال، skyline، نجوم) */
export const SCENE_PAL: Palette = {
  // السطر 428 متل ما هو
};

export const GROUND: PixelMap = [
  // 430–445
];

export const DIRT: PixelMap = [
  // 448–463
];
```

#### `icons.ts` ← 465–497
```ts
import type { PixelMap } from "../svg.ts";

/** أيقونات 9×9 بلون واحد ("#"). بتنرسم بـ CSS mask، فبتاخد currentColor */
export const ICONS = {
  // الأسطر 466–496 متل ما هي (31 أيقونة، والمفاتيح بين "")
} as const satisfies Record<string, PixelMap>;

export type PixelIconName = keyof typeof ICONS;
```

#### `frames.ts` ← 651–659
```ts
import type { Palette, PixelMap } from "../svg.ts";

export const FRAME_PAL: Palette = {
  K: "#14142B",
  W: "#FFFFFF",
  N: "#0C0D22",
  G: "#FFC83D",
  g: "#C98A1A",
  B: "#3E4590",
  R: "#FF6B70",
  T: "#3FE0C5",
};

/**
 * إطارات 9-slice لـ border-image (زوايا بكسل مقصوصة).
 * مصفوفة مش object: في إطار اسمه "1"، والـ object بيرتّب المفاتيح الرقمية أول، فبيتغيّر ترتيب الناتج.
 */
export const FRAMES: readonly (readonly [name: string, map: PixelMap])[] = [
  ["win", [".KKKKK.", "KWWWWWK", "KWNNNWK", "KWN.NWK", "KWNNNWK", "KWWWWWK", ".KKKKK."]],
  ["gold", [".KKKKK.", "KGGGGGK", "KGgggGK", "KGg.gGK", "KGgggGK", "KGGGGGK", ".KKKKK."]],
  ["1", [".K.", "K.K", ".K."]],
  ["field", [".WWW.", "WKKKW", "WK.KW", "WKKKW", ".WWW."]],
  ["field-on", [".GGG.", "GKKKG", "GK.KG", "GKKKG", ".GGG."]],
  ["field-bad", [".RRR.", "RKKKR", "RK.KR", "RKKKR", ".RRR."]],
  ["slot", [".KKK.", "KBBBK", "KB.BK", "KBBBK", ".KKK."]],
  ["slot-on", [".KKK.", "KGGGK", "KG.GK", "KGGGK", ".KKK."]],
];
```

### 4. الـ scenery المولّد: `src/pixel/scene.ts` ← 500–611
نفس الخوارزميات، بس `let`/`const` وأنواع. **ترتيب الحلقات وترتيب مناداة `rng` لازم يضل متل ما هو**: أي تغيير بيطلّع مدينة أو نجوم مختلفة (والفحص بيلقطه).
```ts
type Grid = string[][];

function grid(w: number, h: number): Grid {
  return Array.from({ length: h }, () => new Array<string>(w).fill("."));
}

function rows(g: Grid): string[] {
  return g.map((r) => r.join(""));
}

/** mulberry32: نفس الـ seed = نفس الرسمة بكل build */
function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function disc(g: Grid, cx: number, cy: number, r: number, c: string) {
  for (let y = Math.floor(cy - r); y <= Math.ceil(cy + r); y++) {
    for (let x = Math.floor(cx - r); x <= Math.ceil(cx + r); x++) {
      if (y < 0 || x < 0 || y >= g.length || x >= g[0].length) continue;
      if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r * r) g[y][x] = c;
    }
  }
}

type Circle = readonly [cx: number, cy: number, r: number];

export function clouds(): string[] {
  const w = 192;
  const h = 40;
  const g = grid(w, h);

  const cloud = (ox: number, oy: number, parts: readonly Circle[], base: number) => {
    const c = grid(64, 26);
    for (const [cx, cy, r] of parts) disc(c, cx, cy, r, "w");
    // قاعدة مسطّحة
    for (let y = base + 1; y < 26; y++) for (let x = 0; x < 64; x++) c[y][x] = ".";
    // الظل: آخر صفّين، وأي بكسل تحته بصفّين فاضي
    for (let y = 0; y < 26; y++) {
      for (let x = 0; x < 64; x++) {
        if (c[y][x] === "w" && (y >= base - 1 || c[y + 2]?.[x] === ".")) c[y][x] = "c";
      }
    }
    for (let y = 0; y < 26; y++) {
      for (let x = 0; x < 64; x++) {
        if (c[y][x] !== "." && oy + y < h && ox + x < w) g[oy + y][ox + x] = c[y][x];
      }
    }
  };

  cloud(8, 10, [[14, 14, 7], [25, 10, 9], [37, 12, 8], [47, 15, 6], [6, 17, 4]], 19);
  cloud(112, 2, [[12, 12, 6], [22, 9, 7], [32, 12, 6], [5, 15, 4]], 16);
  return rows(g);
}

type Peak = readonly [x: number, height: number, halfWidth: number];

export function hills(): string[] {
  const w = 128;
  const h = 40;
  const g = grid(w, h);
  const domes: readonly Peak[] = [[30, 30, 40], [96, 21, 30]];
  for (let x = 0; x < w; x++) {
    let top = h;
    let owner: Peak | null = null;
    for (const d of domes) {
      let dx = Math.abs(x - d[0]);
      dx = Math.min(dx, w - dx);
      if (dx > d[2]) continue;
      const t = h - Math.round(d[1] * Math.sqrt(1 - (dx / d[2]) * (dx / d[2])));
      if (t < top) {
        top = t;
        owner = d;
      }
    }
    for (let y = top; y < h; y++) {
      let c = "H";
      if (owner) {
        let sx = x - owner[0];
        if (sx > w / 2) sx -= w;
        if (sx < -w / 2) sx += w;
        const nx = sx / owner[2];
        if (nx > 0.38) c = "d";
        else if (nx > 0.22 && (x + y) % 2 === 0) c = "d";
      }
      g[y][x] = c;
    }
    if (top < h) g[top][x] = "h";
  }
  return rows(g);
}

export function mountains(): string[] {
  const w = 160;
  const h = 56;
  const g = grid(w, h);
  const r = rng(7);
  const peaks: readonly Peak[] = [[28, 46, 36], [82, 36, 30], [132, 52, 38]];
  for (let x = 0; x < w; x++) {
    let top = h;
    let owner: Peak | null = null;
    for (const p of peaks) {
      let dx = Math.abs(x - p[0]);
      dx = Math.min(dx, w - dx);
      if (dx > p[2]) continue;
      const t = h - Math.round(p[1] * (1 - dx / p[2]));
      if (t < top) {
        top = t;
        owner = p;
      }
    }
    // r() بينّادى بس إذا في owner: لا تطلّعه برّا الشرط
    const snow = owner ? h - owner[1] + Math.round(owner[1] * 0.2) + (r() < 0.5 ? 1 : 0) : 0;
    for (let y = top; y < h; y++) {
      let sx = owner ? x - owner[0] : 0;
      if (sx > w / 2) sx -= w;
      if (sx < -w / 2) sx += w;
      const right = sx > 0;
      g[y][x] = y < snow ? (right ? "N" : "n") : right ? "a" : "A";
    }
  }
  return rows(g);
}

export function skyline(): string[] {
  const w = 160;
  const h = 64;
  const g = grid(w, h);
  const r = rng(21);
  let x = 0;
  while (x < w - 6) {
    // ترتيب الـ r(): عرض البناية، طولها، شبابيكها، الأنتين، وبعدين المسافة للبناية الجاية
    let bw = 12 + Math.floor(r() * 12);
    const bh = 22 + Math.floor(r() * 38);
    if (x + bw > w) bw = w - x;
    const top = h - bh;
    for (let y = top; y < h; y++) for (let i = x; i < x + bw; i++) g[y][i] = y === top ? "q" : "Q";
    for (let y = top + 3; y < h - 3; y += 4) {
      for (let i = x + 2; i < x + bw - 3; i += 4) {
        const c = r() < 0.3 ? "y" : "z";
        g[y][i] = c;
        g[y][i + 1] = c;
        g[y + 1][i] = c;
        g[y + 1][i + 1] = c;
      }
    }
    if (r() < 0.35 && top > 6) {
      const ax = x + Math.floor(bw / 2);
      for (let y = top - 5; y < top; y++) g[y][ax] = "q";
    }
    x += bw + 1 + Math.floor(r() * 3);
  }
  return rows(g);
}

export function stars(seed: number): string[] {
  const w = 200;
  const h = 120;
  const g = grid(w, h);
  const r = rng(seed);
  for (let i = 0; i < 46; i++) {
    const y = Math.floor(r() * h); // الصف أول وبعدين العمود، متل المرجع
    const x = Math.floor(r() * w);
    g[y][x] = "W";
  }
  for (let i = 0; i < 7; i++) {
    const x = 2 + Math.floor(r() * (w - 4));
    const y = 2 + Math.floor(r() * (h - 4));
    g[y][x] = "Y";
    g[y - 1][x] = "Y";
    g[y + 1][x] = "Y";
    g[y][x - 1] = "Y";
    g[y][x + 1] = "Y";
  }
  return rows(g);
}
```

### 5. `src/pixel/sheet.ts` ← 633–671
```ts
import { clouds, hills, mountains, skyline, stars } from "./scene.ts";
import { ART, ART_PAL, GEM } from "./sprites/art.ts";
import { FRAME_PAL, FRAMES } from "./sprites/frames.ts";
import { DIRT, GROUND, SCENE_PAL } from "./sprites/ground.ts";
import { HEAD, HERO, HERO_PAL } from "./sprites/hero.ts";
import { ICONS } from "./sprites/icons.ts";
import { strip, svg, uri, type Palette, type PixelMap } from "./svg.ts";

/**
 * كل الـ sprites كـ CSS: `:root{--spr-*;--frame-*;--ico-*}` وبعدها `.i-<name>{--i:var(--ico-<name>)}`.
 * نفس ترتيب الـ add() بالملف المرجعي بالضبط: الناتج لازم يطابقه حرف بحرف (npm run sprites:check).
 */
export function buildSpriteCss(): string {
  let css = ":root{";
  const add = (name: string, map: PixelMap, pal: Palette) => {
    css += `--${name}:${uri(svg(map, pal))};`;
  };

  add("spr-hero", strip(HERO), HERO_PAL);
  add("spr-head", HEAD, HERO_PAL);
  add("spr-gem", strip(GEM), ART_PAL);
  add("spr-gem0", GEM[0], ART_PAL);
  for (const [name, map] of Object.entries(ART)) add(`spr-${name}`, map, ART_PAL);
  add("spr-clouds", clouds(), SCENE_PAL);
  add("spr-hills", hills(), SCENE_PAL);
  add("spr-mountains", mountains(), SCENE_PAL);
  add("spr-skyline", skyline(), SCENE_PAL);
  add("spr-stars", stars(3), SCENE_PAL);
  add("spr-stars2", stars(11), SCENE_PAL);
  add("spr-ground", GROUND, SCENE_PAL);
  add("spr-dirt", DIRT, SCENE_PAL);

  for (const [name, map] of FRAMES) add(`frame-${name}`, map, FRAME_PAL);

  let icons = "";
  for (const [name, map] of Object.entries(ICONS)) {
    add(`ico-${name}`, map, { "#": "#000" });
    icons += `.i-${name}{--i:var(--ico-${name})}`;
  }

  return `${css}}${icons}`;
}
```

### 6. `scripts/build-sprites.mjs`
```js
// node scripts/build-sprites.mjs                    ← بيكتب src/styles/pixel/sprites.generated.css
// node scripts/build-sprites.mjs --check            ← بيفحص التطابق مع المرجع وإنو الملف المولّد محدّث (ما بيكتب شي)
// node scripts/build-sprites.mjs --check --skip-reference  ← بيفحص الملف المولّد بس
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { buildSpriteCss } from "../src/pixel/sheet.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, "src/styles/pixel/sprites.generated.css");
const referenceFile = resolve(root, "design/pixel art.html");

const HEADER =
  "/* GENERATED by scripts/build-sprites.mjs from src/pixel. Do not edit: run `npm run sprites`. */\n";

const css = buildSpriteCss();
const output = `${HEADER}${css}\n`;
const kb = (css.length / 1024).toFixed(1);

/** بيشغّل الـ boot script تبع الملف المرجعي بالذاكرة (document وهمي) وبيرجّع الـ CSS اللي بيولّده */
function referenceCss() {
  const html = readFileSync(referenceFile, "utf8");
  const match = html.match(/<script>\s*\(function \(\) \{([\s\S]*?)\}\)\(\);\s*<\/script>/);
  if (!match) throw new Error("Boot script not found in design/pixel art.html");

  let captured = "";
  const fakeDocument = {
    documentElement: { classList: { add() {}, remove() {} }, dataset: {} },
    createElement: () => ({
      set textContent(value) {
        captured = value;
      },
    }),
    head: { appendChild() {} },
  };
  const matchMedia = () => ({ matches: false });
  new Function("document", "location", "localStorage", "window", "matchMedia", match[1])(
    fakeDocument,
    { hash: "" },
    { getItem: () => null },
    { matchMedia },
    matchMedia,
  );
  return captured;
}

if (process.argv.includes("--check")) {
  const problems = [];

  if (!process.argv.includes("--skip-reference") && css !== referenceCss()) {
    problems.push("src/pixel output differs from design/pixel art.html");
  }

  let onDisk = "";
  try {
    onDisk = readFileSync(outFile, "utf8");
  } catch {
    // الملف لسا ما انولد
  }
  // git عـ Windows ممكن يحوّل LF لـ CRLF بالـ checkout
  if (onDisk.replace(/\r\n/g, "\n") !== output) {
    problems.push("sprites.generated.css is stale: run `npm run sprites`");
  }

  if (problems.length) {
    console.error(problems.map((p) => `✗ ${p}`).join("\n"));
    process.exit(1);
  }
  console.log(`✓ sprites OK (${kb}KB)`);
} else {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, output);
  console.log(`✓ wrote ${relative(root, outFile)} (${kb}KB)`);
}
```

### 7. `package.json`
```json
"scripts": {
  "predev": "npm run sprites",
  "dev": "next dev",
  "prebuild": "npm run sprites",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "format": "prettier --write .",
  "sprites": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/build-sprites.mjs",
  "sprites:check": "node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/build-sprites.mjs --check"
},
"engines": {
  "node": ">=22.18"
},
```
> `--disable-warning`: الـ `package.json` ما فيه `"type": "module"`، فـ Node بيطبع تحذير كل ما يستورد ملف `.ts` فيه ESM. التحذير بس، والشغل صحيح.
> `predev` و`prebuild`: الملف بيتولّد لحاله قبل كل `dev` و`build`. الناتج ثابت (seeds ثابتة)، فما بيطلع diff إلا إذا تغيّرت خريطة.

### 8. `.prettierignore` (ملف جديد بجذر المشروع)
```
src/styles/pixel/sprites.generated.css
```
بدونه `npm run format` بيعيد تنسيق الملف المولّد، والفحص بيفشل.

### 9. ولّد الملف واستورده
```bash
npm run sprites
```
وبـ `src/app/globals.css` ضيف سطر واحد **مباشرة بعد** `tokens.css`:
```css
@import "../styles/pixel/sprites.generated.css";
```
(بدون `layer`: الملف فيه متغيرات وclasses بتعرّف `--i` بس.)

### 10. تجربة سريعة
ضيف للصفحة المؤقتة (`src/app/page.tsx`) جوّا الـ `div`:
```tsx
<div style={{ display: "flex", gap: 24, alignItems: "end" }}>
  <div style={{ width: 64, height: 88, background: "var(--spr-hero) 0 0 / 448px 100% no-repeat" }} />
  <div style={{ width: 64, height: 80, background: "var(--spr-tree) center / contain no-repeat" }} />
  <div style={{ width: 40, height: 36, background: "var(--spr-gem0) center / contain no-repeat" }} />
  <div style={{ width: 640, height: 256, background: "var(--spr-skyline) 0 100% / 640px 100% repeat-x" }} />
</div>
```

## بعد النقل: مين مصدر الحقيقة؟
`src/pixel/`. إذا بدك تعدّل رسمة:
1. عدّل الخريطة بـ `src/pixel/sprites/` وشغّل `npm run sprites`.
2. `sprites:check` رح يفشل على مقارنة المرجع (طبيعي: الرسمة تغيّرت عن قصد). عدّل نفس الخريطة بـ `design/pixel art.html`، أو إذا المرجع ما عاد بيلزم، غيّر السكربت بالـ `package.json` لـ `--check --skip-reference`.

## الملفات
`src/pixel/svg.ts`، `src/pixel/scene.ts`، `src/pixel/sheet.ts`، `src/pixel/sprites/{hero,art,ground,icons,frames}.ts`، `scripts/build-sprites.mjs`، `src/styles/pixel/sprites.generated.css` (مولّد)، `.prettierignore`، `package.json`، `tsconfig.json`، `src/app/globals.css` (سطر واحد)

## Definition of Done
- [x] `npm run sprites:check` ← `✓ sprites OK (94.4KB)`. يعني الناتج مطابق للمرجع byte-by-byte، والملف المولّد محدّث.
- [x] جرّب إنو الفحص بيلقط الغلط: غيّر حرف واحد بـ `hero.ts` ← `sprites:check` بيفشل. رجّعه.
- [x] `npm run lint && npm run build` ناجحين (والـ `prebuild` بيطبع `✓ wrote …`).
- [x] الصفحة المؤقتة: الشخصية (frame الـ idle)، الشجرة، الجوهرة، والـ skyline ظاهرين بحواف حادة (مش مغبّشين).
- [x] `PixelIconName` بيطلع بالـ autocomplete بـ 31 اسم.
- [x] `git status`: `sprites.generated.css` موجود وداخل بالـ commit.

## ملاحظات التنفيذ
- **الملفات انكتبت بسكربت، مش بالإيد:** الكود من الـ code blocks تبع هالملف، والخرائط من `git show 04412b1:"design/pixel art.html"` بأرقام الأسطر المكتوبة فوق. بعدها Prettier رتّب الـ palettes (`"K": '#14142B'` صارت `K: "#14142B"`) وخلّى صفوف الخرائط متل ما هي.
- **بالـ production الـ minifier بيحوّل `url("data:…")` لـ `url(data:…)`** (بدون تنصيص). `sprites:check` بيفحص الملف المصدر، فما بيتأثر. انفحص بالمتصفح: نص الـ SVG بعد فك الترميز مطابق للمرجع بالـ 60 متغير، وبالـ dev القيم مطابقة حرف بحرف. الـ data URIs ما فيها أقواس ولا تنصيص ولا مسافات، فالصيغة بدون تنصيص سليمة.
- **ترتيب الخطوة 9 مهم إذا سيرفر الـ dev شغّال:** ولّد الملف أول وبعدين ضيف الـ import. انعملت بالعكس، فالسيرفر حفظ خطأ `Can't resolve '../styles/pixel/sprites.generated.css'` وضل يرجّع 500 لحد ما تغيّر محتوى `globals.css` (الـ `touch` لحاله ما كفّى).
- **الـ format:** `npx prettier --write src scripts package.json tsconfig.json`، لنفس سبب المرحلة 01.
- **عدد أسماء `PixelIconName`** انفحص بالـ type checker (31 اسم)، مش بالـ autocomplete.
