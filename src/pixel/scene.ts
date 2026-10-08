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

  cloud(
    8,
    10,
    [
      [14, 14, 7],
      [25, 10, 9],
      [37, 12, 8],
      [47, 15, 6],
      [6, 17, 4],
    ],
    19,
  );
  cloud(
    112,
    2,
    [
      [12, 12, 6],
      [22, 9, 7],
      [32, 12, 6],
      [5, 15, 4],
    ],
    16,
  );
  return rows(g);
}

type Peak = readonly [x: number, height: number, halfWidth: number];

export function hills(): string[] {
  const w = 128;
  const h = 40;
  const g = grid(w, h);
  const domes: readonly Peak[] = [
    [30, 30, 40],
    [96, 21, 30],
  ];
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
  const peaks: readonly Peak[] = [
    [28, 46, 36],
    [82, 36, 30],
    [132, 52, 38],
  ];
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
