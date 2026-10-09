import type { Metadata } from "next";

import { ProjectDialogs } from "@/components/projects/project-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import { AboutStage } from "@/components/stages/about";
import { ContactStage } from "@/components/stages/contact";
import { ExperienceStage } from "@/components/stages/experience";
import { ProjectsStage } from "@/components/stages/projects";
import { SkillsStage } from "@/components/stages/skills";
import { TitleScreen } from "@/components/stages/title-screen";
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
      <TitleScreen />
      <AboutStage />
      <SkillsStage />
      <ExperienceStage />
      <ProjectsStage />
      <ContactStage />
      {/* برّا المراحل بقصد: <dialog> مفتوح جوّا مرحلة مخفية بيقفل الصفحة (المرحلة 09) */}
      <ProjectDialogs />
    </>
  );
}
