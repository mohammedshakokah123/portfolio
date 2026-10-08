import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { site } from "@/content/site";
import { homeJsonLd } from "@/lib/seo/json-ld";
import { defaultTitle, sharedOpenGraph } from "@/lib/seo/metadata";

// الـ title والـ description والـ twitter من الـ layout. الـ openGraph كامل هون لأن الدمج shallow
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...sharedOpenGraph,
    type: "profile",
    url: "/",
    title: defaultTitle,
    description: site.ogDescription,
    firstName: "Mohammad",
    lastName: "Shaquqa",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      {/* مؤقت: بينشال بالمرحلة 06 */}
      <div style={{ padding: "120px 20px", display: "grid", gap: 16 }}>
        <h1 style={{ fontSize: 28, color: "#fff", textShadow: "var(--o3)" }}>Pixel foundation</h1>
        <p style={{ color: "var(--ink)" }}>Body text in Pixelify Sans 400.</p>
        <p style={{ color: "var(--ink)", fontWeight: 600 }}>Body text in Pixelify Sans 600.</p>
      </div>
    </>
  );
}
