"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { play } from "@/game/sound";
import type { Shot } from "@/types/content";

/**
 * شبكة الصور + عارض (lightbox) فوقها. العارض <dialog> تاني: بيطلع فوق مودال المشروع (top layer)،
 * والمتصفح بيتكفّل بالـ focus trap والـ Esc ورجوع الـ focus للصورة المصغّرة.
 * التسكير (زر X والضغط عالـ backdrop) بيلقطه dialogs.ts متل أي مودال. التنقل بالأسهم وبيلف من الآخر للأول.
 */
export function ProjectGallery({ shots }: { shots: readonly Shot[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  // الصورة الكبيرة ما بتنرسم قبل أول فتح: ما منحمّل صورة بالحجم الكامل لحدا ما كبس عليها
  const [opened, setOpened] = useState(false);
  const shot = shots[active];
  const iconBtn = btn({ variant: "ghost", size: "icon" });

  const show = (index: number) => {
    setActive(index);
    setOpened(true);
    play("select");
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setActive((i) => (i + delta + shots.length) % shots.length);

  return (
    <>
      <ul className="shots">
        {shots.map((s, i) => (
          <li key={s.src}>
            <figure>
              <button type="button" className="shot" aria-haspopup="dialog" onClick={() => show(i)}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 719px) calc(100vw - 80px), 351px"
                />
              </button>
              <figcaption>{s.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="modal lightbox"
        aria-label="Screenshot viewer"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        <div className="win modal-win">
          <div className="lightbox-bar">
            <p className="lightbox-count" aria-live="polite">
              {active + 1} / {shots.length}
            </p>
            <button
              type="button"
              className={iconBtn}
              data-close
              aria-label="Close screenshot viewer"
            >
              <PixelIcon name="close" />
            </button>
          </div>

          <div className="lightbox-shot">
            {opened && shot && (
              <Image
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1280px) 80rem, 100vw"
              />
            )}
          </div>

          <div className="lightbox-bar">
            <button
              type="button"
              className={iconBtn}
              onClick={() => step(-1)}
              aria-label="Previous screenshot"
            >
              <PixelIcon name="arrow-left" />
            </button>
            <p className="lightbox-caption">{shot?.caption}</p>
            <button
              type="button"
              className={iconBtn}
              onClick={() => step(1)}
              aria-label="Next screenshot"
            >
              <PixelIcon name="arrow-right" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
