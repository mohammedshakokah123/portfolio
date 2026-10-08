"use client";

import { PixelIcon } from "@/components/pixel/pixel-icon";
import { soundStore, toggleSound } from "@/game/sound";
import { useStore } from "@/game/store";

type SoundToggleProps = {
  className: string;
  /** نص الزر (بقائمة الـ pause). بدونه الزر أيقونة بس، وبياخد aria-label */
  children?: React.ReactNode;
};

export function SoundToggle({ className, children }: SoundToggleProps) {
  const on = useStore(soundStore, false);

  return (
    <button
      type="button"
      className={className}
      aria-pressed={on}
      aria-label={children ? undefined : "Sound effects"}
      onClick={toggleSound}
    >
      <PixelIcon name={on ? "sound-on" : "sound-off"} />
      {children}
    </button>
  );
}
