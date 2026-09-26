import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { OgCard } from "@/lib/seo/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} | ${site.role}`;

// TODO: لما تنحط الصورة الشخصية، حطها دائرة عاليمين: الرابط بيبين أوضح لما ينشارك على LinkedIn
export default function OpengraphImage() {
  return new ImageResponse(
    <OgCard
      eyebrow={site.role}
      title={site.name}
      subtitle="React · Next.js · TypeScript"
      meta={new URL(site.url).host}
    />,
    size,
  );
}
