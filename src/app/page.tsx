// Temporary section stubs for phase 04 (nav, active state, focus); replaced by the real sections from phase 05.
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";

const stubs = ["about", "skills", "experience", "projects", "contact"] as const;

export default function Home() {
  return (
    <>
      <Section id="top" labelledBy="hero-title">
        <h1 id="hero-title" className="text-foreground text-3xl font-semibold tracking-tight">
          {site.hero.title}
        </h1>
      </Section>
      {stubs.map((id, i) => (
        <Section key={id} id={id} labelledBy={`${id}-title`} bordered={i < stubs.length - 1}>
          <div className="min-h-[60vh]">
            <SectionHeading id={`${id}-title`} {...site.sections[id]} />
          </div>
        </Section>
      ))}
    </>
  );
}
