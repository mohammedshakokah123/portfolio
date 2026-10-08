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
  for (const [c, d] of Object.entries(paths))
    out += `<path fill="${pal[c] ?? "#f0f"}" d="${d.join("")}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${out}</svg>`;
}

export function uri(svgText: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svgText)}")`;
}

/** frames جنب بعض بخريطة وحدة (sprite strip أفقي) */
export function strip(frames: readonly PixelMap[]): string[] {
  return frames[0].map((_, y) => frames.map((f) => f[y]).join(""));
}
