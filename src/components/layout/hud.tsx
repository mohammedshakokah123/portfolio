import { GemCounter } from "@/components/game/gem-counter";
import { HudNav } from "@/components/game/hud-nav";
import { SoundToggle } from "@/components/game/sound-toggle";
import { TimeToggle } from "@/components/game/time-toggle";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { site } from "@/content/site";

export function Hud() {
  return (
    <header className="hud">
      <a className="hud-player" href="#home" aria-label={`${site.name}, back to title screen`}>
        <span className="hud-avatar" aria-hidden="true" />
        <span className="hud-name" aria-hidden="true">
          <b>
            <span className="full">{site.name}</span>
            <span className="short">{site.shortName}</span>
          </b>
          <small>{site.role}</small>
        </span>
      </a>

      <HudNav />

      <div className="hud-tools">
        <p className="hud-gems" title={labels.gems.title}>
          <span className="gem-ico" aria-hidden="true" />
          <span className="sr-only">{labels.gems.title}:</span>
          <GemCounter />
        </p>
        <SoundToggle className={btn({ variant: "ghost", size: "icon" }, "sound-btn")} />
        <TimeToggle className={btn({ variant: "ghost", size: "icon" })} />
        <a className={btn({}, "btn-cv")} href={site.cvPath} download>
          <PixelIcon name="download" />
          <span className="cv-full">Download CV</span>
          <span className="cv-short">CV</span>
        </a>
        {/* data-dialog: المحرك (المرحلة 06) بيفتح الـ <dialog> اللي الـ id تبعه هالقيمة */}
        <button
          type="button"
          className={btn({ variant: "ghost" }, "menu-btn")}
          data-dialog="pause-menu"
          aria-haspopup="dialog"
          aria-controls="pause-menu"
        >
          <PixelIcon name="menu" />
          <span className="menu-label">Menu</span>
        </button>
      </div>
    </header>
  );
}
