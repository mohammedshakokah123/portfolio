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
