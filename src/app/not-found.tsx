import type { Metadata } from "next";
import Link from "next/link";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";

// الـ robots صريح: غير هيك بيورث "index, follow" من الـ layout جنب الـ noindex اللي Next بيحطه لحاله
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/**
 * stage-solo: بتضل ظاهرة مهما كان data-stage (stages.css). الـ HUD والعالم من الـ layout.
 * روابط المراحل بالـ HUD هون بتودّي عالرئيسية (router.ts: onHome)، وGameRoot بيعيد تشغيل المحرك بعد الرجوع.
 */
export default function NotFound() {
  return (
    <section className="stage stage-solo" aria-labelledby="not-found-title">
      <div className="stage-inner home-inner">
        <p className="stage-no">Error 404</p>
        <h1 id="not-found-title" className="stage-title">
          Game over
        </h1>
        <div className="win home-win">
          <p className="lead">This stage doesn&apos;t exist.</p>
          <p className="muted">
            The page you&apos;re looking for was moved, or it was never part of the map.
          </p>
        </div>
        <Link className={btn({ size: "start" })} href="/">
          <PixelIcon name="play" />
          Continue
        </Link>
      </div>
    </section>
  );
}
