"use client";

import { stageStore } from "@/game/stage-store";
import { STAGE_NAMES, STAGES } from "@/game/stages";
import { useStore } from "@/game/store";

/** كل المراحل ما عدا شاشة البداية (رابطها هو الاسم بأول الـ HUD) */
const NAV = STAGES.slice(1);

export function HudNav() {
  const current = useStore(stageStore, "home");

  return (
    <nav className="hud-nav" aria-label="Stages">
      <ol>
        {NAV.map((id, i) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={current === id ? "page" : undefined}>
              <span className="hud-num" aria-hidden="true">
                {i + 1}
              </span>
              {STAGE_NAMES[id]}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
