"use client";

import { GemCounter } from "@/components/game/gem-counter";
import { SoundToggle } from "@/components/game/sound-toggle";
import { TimeToggle } from "@/components/game/time-toggle";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { stageStore } from "@/game/stage-store";
import { STAGE_NAMES, STAGES, type StageId } from "@/game/stages";
import { useStore } from "@/game/store";
import type { PixelIconName } from "@/pixel/sprites/icons";

const ICON: Record<StageId, PixelIconName> = {
  home: "home",
  about: "profile",
  skills: "code",
  experience: "briefcase",
  projects: "grid",
  contact: "mail",
};

/** قائمة التنقل تحت 1240px (لما الـ nav بيختفي من الـ HUD). بتنفتح بزر Menu (data-dialog="pause-menu") */
export function PauseMenu() {
  const current = useStore(stageStore, "home");
  const small = btn({ variant: "ghost", size: "small" });

  return (
    <dialog
      id="pause-menu"
      className="modal"
      aria-labelledby="pause-title"
      style={{ width: "min(100% - 24px, 420px)" }}
    >
      <div className="win pause-win">
        <h2 id="pause-title" className="pause-title">
          {labels.pause.title}
        </h2>
        <p className="pause-sub">{labels.pause.sub}</p>
        <p className="pause-gems">
          <span className="gem-ico" aria-hidden="true" />
          <span>
            <GemCounter />
            {` ${labels.pause.gems}`}
          </span>
        </p>

        <nav aria-label="Stages (menu)">
          <ul className="pause-list">
            {STAGES.map((id, i) => (
              <li key={id}>
                <a href={`#${id}`} aria-current={current === id ? "page" : undefined}>
                  <PixelIcon name={ICON[id]} />
                  {i === 0 ? "Title screen" : `${i}. ${STAGE_NAMES[id]}`}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pause-tools">
          <SoundToggle className={small}>Sound</SoundToggle>
          <TimeToggle className={small}>Night</TimeToggle>
        </div>
        <button type="button" className={btn({}, "pause-resume")} data-close>
          <PixelIcon name="play" />
          {labels.pause.resume}
        </button>
      </div>
    </dialog>
  );
}
