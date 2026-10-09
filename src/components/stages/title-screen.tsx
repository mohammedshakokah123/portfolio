import { Fragment } from "react";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function TitleScreen() {
  const words = site.name.split(" ");
  // رقم أول حرف بكل كلمة: الحروف بتنزل ورا بعض عبر السطرين (--i من 0 لـ 14، و70ms بين كل حرف)
  const offsets = words.map((_, w) => words.slice(0, w).join("").length);

  return (
    <section id="home" className="stage" aria-labelledby="home-title">
      <div className="stage-inner home-inner">
        {/* الـ h1 الوحيد بالصفحة. aria-label: قارئ الشاشة بيقرأ الاسم مرة وحدة، مش حرف حرف */}
        <h1
          id="home-title"
          className="title-logo"
          tabIndex={-1}
          data-stage-title
          aria-label={site.name}
        >
          {words.map((word, w) => (
            <Fragment key={word}>
              {/* المسافة ضرورية: السطرين block بالـ CSS بس، وبدونها النص الخام بيصير "MohammadShakokah" */}
              {w > 0 && " "}
              <span className={cn("row", w % 2 === 1 && "row-gold")} aria-hidden="true">
                {[...word].map((letter, l) => (
                  <span key={l} style={{ "--i": offsets[w] + l } as React.CSSProperties}>
                    {letter}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="title-class">{site.role}</p>

        <div className="win home-win">
          <p className="lead">{site.home.lead}</p>
          <p className="muted">{site.home.sub}</p>
        </div>

        <div className="title-menu">
          {/* btn-start: الـ router بيعرفه من الـ class وبيشغّل صوت البداية وقفزة الشخصية */}
          <a className={btn({ size: "start" })} href="#about">
            <PixelIcon name="play" />
            {labels.title.start}
          </a>
          <a className={btn({ variant: "ghost" })} href={site.cvPath} download>
            <PixelIcon name="download" />
            {labels.title.cv}
          </a>
          <a className={btn({ variant: "ghost" })} href="#contact">
            <PixelIcon name="mail" />
            {labels.title.contact}
          </a>
        </div>

        <ul className="facts" aria-label={labels.title.facts}>
          {site.home.facts.map(({ icon, text, tone }) => (
            <li key={text} className={cn("chip", tone === "green" && "chip-green")}>
              <PixelIcon name={icon} />
              {text}
            </li>
          ))}
        </ul>

        <p className="hint">{labels.title.hint}</p>
      </div>
    </section>
  );
}
