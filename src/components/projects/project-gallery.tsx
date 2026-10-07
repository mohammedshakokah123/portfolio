"use client";

import { ChevronLeft, ChevronRight, XIcon } from "lucide-react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Project } from "@/types/content";

type ProjectGalleryProps = { shots: NonNullable<Project["gallery"]> };

/**
 * شبكة الصور + عارض (lightbox) فوقها. الـ Dialog تبع Radix بيتكفل بالـ focus trap والـ Esc وقفل السكرول.
 * التنقل بالأسهم (كيبورد وأزرار) وبيلف من الآخر للأول.
 */
export function ProjectGallery({ shots }: ProjectGalleryProps) {
  // الـ index بيضل محفوظ بعد التسكير: المحتوى بيضل مرسوم لحد ما يخلص الـ fade-out
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const shot = shots[active];

  // بدون Dialog.Trigger الـ Radix ما بيعرف لوين يرجّع الـ focus، فمنحفظ الزر اللي فتح العارض
  const opener = useRef<HTMLButtonElement>(null);

  const show = (i: number, button: HTMLButtonElement) => {
    opener.current = button;
    setActive(i);
    setOpen(true);
  };
  const step = (delta: number) => setActive((i) => (i + delta + shots.length) % shots.length);

  return (
    <>
      <ul className="mt-4 grid gap-x-4 gap-y-6 sm:grid-cols-2">
        {shots.map((s, i) => (
          <li key={s.src}>
            <figure>
              <button
                type="button"
                aria-haspopup="dialog"
                onClick={(e) => show(i, e.currentTarget)}
                className="border-border hover:border-brand/40 focus-visible:ring-ring relative block aspect-16/10 w-full cursor-zoom-in overflow-hidden rounded-lg border transition-[border-color] duration-200 focus-visible:ring-2 focus-visible:outline-none"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 768px) 22rem, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </button>
              <figcaption className="text-subtle mt-2 text-sm">{s.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 z-50 bg-black/75 duration-200 supports-backdrop-filter:backdrop-blur-xs" />
          {shot && (
            <Dialog.Content
              aria-describedby={undefined}
              onCloseAutoFocus={(e) => {
                e.preventDefault();
                opener.current?.focus();
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") step(-1);
                if (e.key === "ArrowRight") step(1);
              }}
              // العرض محسوب من الارتفاع المتاح (16:10) مشان الصورة تضل كلها جوّا الشاشة
              className="border-border bg-popover text-popover-foreground data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed top-1/2 left-1/2 z-50 w-[min(calc(100vw-2rem),calc((100dvh-9rem)*1.6))] -translate-1/2 overflow-hidden rounded-lg border shadow-lg duration-200 focus:outline-none"
            >
              <div className="flex items-center justify-between gap-4 py-2 pr-2 pl-4">
                <p className="text-subtle text-xs tabular-nums" aria-live="polite">
                  {active + 1} / {shots.length}
                </p>
                <Dialog.Close asChild>
                  <Button variant="ghost" size="icon-sm">
                    <XIcon aria-hidden />
                    <span className="sr-only">Close</span>
                  </Button>
                </Dialog.Close>
              </div>

              <div className="bg-muted relative aspect-16/10">
                <Image
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 1280px) 80rem, 100vw"
                  className="object-contain"
                />
              </div>

              <div className="flex items-center gap-3 p-2">
                <Button variant="outline" size="icon-lg" onClick={() => step(-1)}>
                  <ChevronLeft aria-hidden />
                  <span className="sr-only">Previous screenshot</span>
                </Button>
                <Dialog.Title className="text-foreground flex-1 text-center text-sm">
                  {shot.caption}
                </Dialog.Title>
                <Button variant="outline" size="icon-lg" onClick={() => step(1)}>
                  <ChevronRight aria-hidden />
                  <span className="sr-only">Next screenshot</span>
                </Button>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
