import { Reveal } from "@/components/motion/reveal";
import { RichTextParagraph } from "@/components/shared/rich-text-paragraph";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";

export function About() {
  return (
    <Section id="about" labelledBy="about-title" className="grid gap-10 lg:grid-cols-[16rem_1fr]">
      <Reveal>
        <SectionHeading id="about-title" {...site.sections.about} />
      </Reveal>
      <div className="text-muted-foreground max-w-3xl space-y-5 text-base leading-relaxed">
        <Reveal delay={0.1} className="space-y-5">
          {site.about.paragraphs.map((p, i) => (
            <RichTextParagraph key={i} text={p} />
          ))}
        </Reveal>
        <ul className="grid gap-3 pt-2 sm:grid-cols-3">
          {site.about.principles.map(({ icon: Icon, title, description }, i) => (
            <Reveal as="li" key={title} col={i % 3} className="border-border rounded-lg border p-4">
              <Icon className="text-brand size-5" aria-hidden />
              <h3 className="text-emphasis mt-3 text-sm font-medium">{title}</h3>
              <p className="text-subtle mt-1 text-sm">{description}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
