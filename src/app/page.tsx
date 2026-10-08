import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { Stage } from "@/components/stages/stage";
import { site } from "@/content/site";
import { GEM_IDS, STAGE_NAMES } from "@/game/stages";
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

      {/* مؤقت: بيتبدّل بـ <TitleScreen /> بالمرحلة 07 */}
      <section id="home" className="stage" aria-labelledby="home-title">
        <div className="stage-inner">
          <h1 id="home-title" className="stage-title" tabIndex={-1} data-stage-title>
            {site.name}
          </h1>
          <p style={{ marginTop: 24 }}>
            <a className="btn btn-start" href="#about">
              Press start
            </a>
          </p>
        </div>
      </section>

      {/* مؤقت: كل مرحلة بتتبدّل بمكوّنها بالمراحل 07 لـ 10 */}
      {GEM_IDS.map((id) => (
        <Stage key={id} id={id}>
          <div className="win">
            <p>{STAGE_NAMES[id]} content comes in a later phase.</p>
          </div>
        </Stage>
      ))}
    </>
  );
}
