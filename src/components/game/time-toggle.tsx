"use client";

import { play } from "@/game/sound";
import { useStore } from "@/game/store";
import { timeStore, toggleTime } from "@/game/time";

type TimeToggleProps = {
  className: string;
  /** نص الزر (بقائمة الـ pause). بدونه الزر أيقونة بس، وبياخد aria-label */
  children?: React.ReactNode;
};

/** الأيقونة (قمر بالنهار، شمس بالليل) من الـ CSS حسب data-time: .time-ico بـ hud.css */
export function TimeToggle({ className, children }: TimeToggleProps) {
  const night = useStore(timeStore, "day") === "night";

  return (
    <button
      type="button"
      className={className}
      aria-pressed={night}
      aria-label={children ? undefined : "Night mode"}
      onClick={() => {
        toggleTime();
        play("toggle");
      }}
    >
      <span className="ico time-ico" aria-hidden="true" />
      {children}
    </button>
  );
}
