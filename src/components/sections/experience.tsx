import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechList } from "@/components/shared/tech-badge";
import { experience } from "@/content/experience";
import { site } from "@/content/site";
import { formatYearMonth } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types/content";

export function Experience() {
  return (
    <Section
      id="experience"
      labelledBy="experience-title"
      className="grid gap-10 lg:grid-cols-[16rem_1fr]"
    >
      <SectionHeading id="experience-title" {...site.sections.experience} />

      <ol className="border-border relative border-l">
        {experience.map((item, i) => (
          <TimelineItem
            key={`${item.org}-${item.period.start}`}
            item={item}
            last={i === experience.length - 1}
          />
        ))}
      </ol>
    </Section>
  );
}

function TimelineItem({ item, last }: { item: ExperienceItem; last: boolean }) {
  const MetaIcon = item.meta.icon;

  return (
    <li className={cn("relative pl-8", !last && "pb-12")}>
      {/* النقطة بنص الخط: الـ brand بس للشغل الحالي (end === null) */}
      <span
        aria-hidden
        className={cn(
          "bg-background absolute top-1.5 -left-[7px] size-3 rounded-full border-2",
          item.period.end === null ? "border-brand" : "border-subtle",
        )}
      />
      <article>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="text-foreground text-lg font-semibold">
            {item.title} <span className="text-subtle font-normal">at</span> {item.org}
          </h3>
          <p className="text-subtle text-sm">
            <PeriodLabel period={item.period} />
          </p>
        </div>
        <p className="text-subtle mt-1 flex items-center gap-1.5 text-sm">
          <MetaIcon className="size-3.5" aria-hidden />
          {item.meta.text}
        </p>
        <ul className="text-muted-foreground mt-4 space-y-2.5 text-[15px] leading-relaxed">
          {item.highlights.map((h) => (
            <li key={h} className="flex gap-3">
              <span aria-hidden className="bg-subtle mt-2.5 size-1 shrink-0 rounded-full" />
              {h}
            </li>
          ))}
        </ul>
        {item.tech && <TechList items={item.tech} label="Technologies used" className="mt-5" />}
      </article>
    </li>
  );
}

/** "Feb 2025 – Sep 2026" بـ <time dateTime>، وإذا ما في end بيكتب "Present" بدون <time> */
function PeriodLabel({ period }: { period: ExperienceItem["period"] }) {
  return (
    <>
      <time dateTime={period.start}>{formatYearMonth(period.start)}</time> –{" "}
      {period.end ? <time dateTime={period.end}>{formatYearMonth(period.end)}</time> : "Present"}
    </>
  );
}
