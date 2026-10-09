import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { OgCard } from "@/lib/seo/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} | ${site.role}`;

export default async function OpengraphImage() {
  const pressStart = await readFile(
    join(process.cwd(), "src/assets/fonts/PressStart2P-Regular.ttf"),
  );

  return new ImageResponse(
    <OgCard
      name={site.name}
      role={site.role}
      stack="React / Next.js / TypeScript"
      host={new URL(site.url).host}
    />,
    {
      ...size,
      fonts: [{ name: "Press Start 2P", data: pressStart, weight: 400, style: "normal" }],
    },
  );
}
