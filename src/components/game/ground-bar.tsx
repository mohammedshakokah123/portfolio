"use client";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { stageStore } from "@/game/stage-store";
import { STAGE_NAMES, STAGES, type StageId } from "@/game/stages";
import { useStore } from "@/game/store";

const longName = (id: StageId) => (id === "home" ? "Title screen" : STAGE_NAMES[id]);

/** name وyear من الـ layout (Server): الـ client components ما بتستورد @/content/site */
export function GroundBar({ name, year }: { name: string; year: number }) {
  const current = useStore(stageStore, "home");
  const i = STAGES.indexOf(current);
  const prev = i > 0 ? STAGES[i - 1] : null;
  // بعد آخر مرحلة منرجع لشاشة البداية
  const next = STAGES[i + 1] ?? "home";
  const dark = btn({ variant: "dark" });

  return (
    <footer className="ground-bar">
      {prev ? (
        <a className={dark} href={`#${prev}`} aria-label={`Previous stage: ${longName(prev)}`}>
          <PixelIcon name="arrow-left" />
          <span>{STAGE_NAMES[prev]}</span>
        </a>
      ) : (
        // بيحفظ مكان الزر مشان النص يضل بالنص
        <span className="spacer" />
      )}
      <p className="credits-mini">
        &copy; {year} {name}
      </p>
      <a className={dark} href={`#${next}`} aria-label={`Next stage: ${longName(next)}`}>
        <span>{STAGE_NAMES[next]}</span>
        <PixelIcon name="arrow-right" />
      </a>
    </footer>
  );
}
