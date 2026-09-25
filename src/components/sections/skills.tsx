import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { site } from "@/content/site";
import { skills } from "@/content/skills";

/** حيلة الـ gap-px: خلفية الـ grid هي لون الـ border، فالفراغ (1px) بين الكروت بيبان كخط فاصل */
export function Skills() {
  return (
    <Section id="skills" labelledBy="skills-title" className="grid gap-10 lg:grid-cols-[16rem_1fr]">
      <SectionHeading id="skills-title" {...site.sections.skills} />

      <div className="border-border bg-border grid gap-px overflow-hidden rounded-lg border sm:grid-cols-2">
        {skills.map(({ title, icon: Icon, items }) => (
          <article key={title} className="bg-background p-6">
            <h3 className="text-foreground flex items-center gap-2.5 text-sm font-semibold">
              <Icon className="text-brand size-4" aria-hidden />
              {title}
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm">
              {items.map((s) => (
                <li
                  key={s}
                  className="border-border bg-muted text-body rounded-md border px-2.5 py-1"
                >
                  {s}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
