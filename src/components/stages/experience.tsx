import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { Stage } from "@/components/stages/stage";
import { careerMap, experience } from "@/content/experience";
import { labels } from "@/content/labels";
import { formatYearMonth } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types/content";

export function ExperienceStage() {
  return (
    <Stage id="experience">
      <div className="win map">
        <h3 className="sr-only">{labels.experience.map}</h3>
        <ol className="map-path">
          {careerMap.map(({ sprite, year, label, next }) => (
            <li key={label} className={cn("map-node", next && "is-next")}>
              {next && <span className="map-hero" aria-hidden="true" />}
              <span className="map-icon" aria-hidden="true">
                {/* --s: الـ CSS بيرسم الـ sprite من هالمتغيّر */}
                <i style={{ "--s": `var(--spr-${sprite})` } as React.CSSProperties} />
              </span>
              <span className="map-year">{year}</span>
              <span className="map-label">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="quests">
        {experience.map((item, i) => (
          <Quest
            key={`${item.org}-${item.period.start}`}
            id={`quest-${i}`}
            item={item}
            // الأحدث (أول واحد) بياخد الإطار الدهبي
            featured={i === 0}
          />
        ))}
      </div>
    </Stage>
  );
}

function Quest({ id, item, featured }: { id: string; item: ExperienceItem; featured: boolean }) {
  const current = item.period.end === null;

  return (
    <article className={cn("win quest", featured && "win-gold")} aria-labelledby={id}>
      <p className={cn("quest-badge", !current && "done")}>
        {current ? labels.experience.current : labels.experience.done}
      </p>
      <h3 id={id}>
        {item.title} <span className="at">at</span> {item.org}
      </h3>
      <p className="quest-meta">
        <span>
          <PixelIcon name={item.meta.icon} />
          <Period period={item.period} />
        </span>
        <span>
          <PixelIcon name="check" />
          {item.meta.text}
        </span>
      </p>
      <ul className="quest-list">
        {item.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      {item.tech && <Tags items={item.tech} label={labels.experience.tech} />}
    </article>
  );
}

/**
 * "Feb 2025 – Sep 2026" بـ <time dateTime>، وإذا ما في end: "Present" بدون <time>.
 * بدون span حواليه: الأب inline-flex مع gap، والمرجع حاطط الـ <time> والشرطة عناصر مباشرة جوّاه.
 * الـ   (non-breaking space) متل الـ &nbsp; بالمرجع.
 */
function Period({ period }: { period: ExperienceItem["period"] }) {
  return (
    <>
      <time dateTime={period.start}>{formatYearMonth(period.start)}</time>
      {" – "}
      {period.end ? <time dateTime={period.end}>{formatYearMonth(period.end)}</time> : "Present"}
    </>
  );
}
