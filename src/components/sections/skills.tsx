import { Reveal } from "@/components/motion/reveal";
import { IconTile } from "@/components/shared/icon-tile";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/**
 * حيلة الـ gap-px: خلفية الـ grid هي لون الـ border، فالفراغ (1px) بين الكروت بيبان كخط فاصل.
 * الحركة على محتوى الكرت مش على الـ article نفسه: لو الـ article شفاف وقت الـ fade، بتبيّن خلفية الـ grid من وراه.
 * الـ chips بتطلع وحدة ورا التانية (data-reveal-item مع --i) بعد ما يبين الكرت.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      labelledBy="skills-title"
      band
      className="grid gap-10 lg:grid-cols-[16rem_1fr]"
    >
      <Reveal>
        <SectionHeading id="skills-title" {...site.sections.skills} />
      </Reveal>

      <div className="border-border bg-border grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2">
        {skills.map(({ title, icon: Icon, items }, i) => (
          <article key={title} className="bg-background p-6">
            <Reveal col={i % 2}>
              <h3 className="text-foreground flex items-center gap-2.5 text-sm font-semibold">
                <IconTile size="sm">
                  <Icon className="size-4" aria-hidden />
                </IconTile>
                {title}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2 text-sm">
                {items.map((s, j) => (
                  <li
                    key={s}
                    data-reveal-item
                    style={{ "--i": j } as React.CSSProperties}
                    className="border-border bg-muted text-body rounded-md border px-2.5 py-1"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Reveal>
          </article>
        ))}
      </div>
    </Section>
  );
}
