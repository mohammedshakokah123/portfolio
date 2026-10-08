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
