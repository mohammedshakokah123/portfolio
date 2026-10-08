import type { Metadata } from "next";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { FRAMES } from "@/pixel/sprites/frames";
import { ICONS, type PixelIconName } from "@/pixel/sprites/icons";

export const metadata: Metadata = { title: "UI kit", robots: { index: false } };

const iconNames = Object.keys(ICONS) as PixelIconName[];
const row = { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" } as const;

export default function KitPage() {
  return (
    <div
      style={{
        maxWidth: 1120,
        margin: "0 auto",
        padding: "48px 20px 160px",
        display: "grid",
        gap: 26,
      }}
    >
      <div className="win">
        <h2 className="win-title">Window</h2>
        <p>Default window: navy panel, white pixel frame with notched corners.</p>
      </div>

      <div className="win win-gold">
        <h2 className="win-title">Gold window</h2>
        <p>Used for the current quest.</p>
      </div>

      <div className="win">
        <h2 className="win-title">Buttons</h2>
        <div style={row}>
          <button type="button" className={btn()}>
            <PixelIcon name="mail" />
            Gold
          </button>
          <button type="button" className={btn({ variant: "ghost" })}>
            <PixelIcon name="download" />
            Ghost
          </button>
          <button type="button" className={btn({ variant: "dark" })}>
            Dark
            <PixelIcon name="arrow-right" />
          </button>
          <button type="button" className={btn({ size: "small" })}>
            Small
          </button>
          <button
            type="button"
            className={btn({ variant: "ghost", size: "icon" })}
            aria-label="Icon button"
          >
            <PixelIcon name="moon" />
          </button>
          <button
            type="button"
            className={btn({ variant: "ghost", size: "icon" })}
            aria-pressed="true"
            aria-label="Pressed"
          >
            <PixelIcon name="sun" />
          </button>
        </div>
      </div>

      <div className="win">
        <h2 className="win-title">Chips and tags</h2>
        <ul style={row}>
          <li className="chip">
            <PixelIcon name="cap" />
            Chip with an icon
          </li>
          <li className="chip">
            <PixelIcon name="briefcase" />
            Another chip
          </li>
        </ul>
        <div style={{ marginTop: 16 }}>
          <Tags items={["React", "Next.js", "TypeScript"]} label="Sample tags" />
        </div>
      </div>

      <div className="win">
        <h2 className="win-title">Icons ({iconNames.length})</h2>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 16,
          }}
        >
          {iconNames.map((name) => (
            <li
              key={name}
              style={{ display: "grid", justifyItems: "center", gap: 8, fontSize: 15 }}
            >
              <PixelIcon name={name} size="lg" />
              {name}
            </li>
          ))}
        </ul>
        <div style={{ ...row, marginTop: 20, color: "var(--teal)" }}>
          <PixelIcon name="bolt" />
          <PixelIcon name="bolt" size="lg" />
          <PixelIcon name="bolt" size="xl" />
        </div>
      </div>

      <div className="win">
        <h2 className="win-title">Frames ({FRAMES.length})</h2>
        <ul style={row}>
          {FRAMES.map(([name, map]) => (
            <li
              key={name}
              style={{
                padding: "8px 14px",
                background: "var(--panel-2) padding-box",
                border: `calc(${(map.length - 1) / 2} * var(--b)) solid transparent`,
                borderImage: `var(--frame-${name}) ${(map.length - 1) / 2} / calc(${(map.length - 1) / 2} * var(--b)) stretch`,
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
