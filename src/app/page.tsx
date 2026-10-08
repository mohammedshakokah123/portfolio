import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { AboutStage } from "@/components/stages/about";
import { Stage } from "@/components/stages/stage";
import { TitleScreen } from "@/components/stages/title-screen";
import { site } from "@/content/site";
import { STAGE_NAMES } from "@/game/stages";
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

      <TitleScreen />
      <AboutStage />

      {/* مؤقت: بيتبدّلوا بالمراحل 08 لـ 10 */}
      {(["skills", "experience", "projects", "contact"] as const).map((id) => (
        <Stage key={id} id={id}>
          <div className="win">
            <p>{STAGE_NAMES[id]} content comes in a later phase.</p>
          </div>
        </Stage>
      ))}
    </>
  );
}
