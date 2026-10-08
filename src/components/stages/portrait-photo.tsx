"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { play } from "@/game/sound";
import { cn } from "@/lib/utils";

/** حجم الـ canvas: 36×36 بكسل، والـ CSS بيكبّره بـ image-rendering: pixelated */
const PIXELS = 36;

/**
 * الصورة بتبين 8-bit (canvas فوقها)، وبتصير HD بالـ hover أو بالزر.
 * الحالات بالـ CSS: has-photo (الـ canvas انرسم)، no-photo (الصورة فشلت ← راس الشخصية)، is-hd (الزر مكبوس).
 */
export function PortraitPhoto({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "photo" | "failed">("loading");
  const [hd, setHd] = useState(false);

  // مربع من نص الصورة (لو الصورة مش مربعة) مرسوم مصغّر على الـ canvas
  const pixelate = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = PIXELS;
    canvas.height = PIXELS;
    // الصورة كلها مرسومة بحيث الضلع الأقصر = حجم الـ canvas، والزيادة برّا الحدود (نفس قصّ المرجع من النص).
    // مش بمستطيل مصدر متل المرجع: مع srcset تبع next/image الـ naturalWidth بيطلع بمقاس الـ CSS، والـ canvas
    // بيقرأ المستطيل ببكسلات الملف الفعلي، فبتطلع الصورة مقصوصة ومكبّرة
    const scale = PIXELS / Math.min(img.naturalWidth, img.naturalHeight);
    const width = img.naturalWidth * scale;
    const height = img.naturalHeight * scale;
    ctx.drawImage(img, (PIXELS - width) / 2, (PIXELS - height) / 2, width, height);
    setState("photo");
  };

  return (
    <figure
      className={cn(
        "portrait",
        state === "photo" && "has-photo",
        state === "failed" && "no-photo",
        hd && "is-hd",
      )}
    >
      <div className="portrait-frame">
        <Image
          src={src}
          alt={alt}
          width={480}
          height={480}
          sizes="(max-width: 719px) 260px, (max-width: 1023px) 220px, 340px"
          onLoad={(e) => pixelate(e.currentTarget)}
          onError={() => setState("failed")}
        />
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="portrait-fallback" aria-hidden="true" />
      </div>
      <figcaption>
        <button
          type="button"
          className={btn({ variant: "ghost", size: "small" }, "portrait-toggle")}
          aria-pressed={hd}
          onClick={() => {
            play(hd ? "select" : "gem"); // "gem" لما تنكشف الصورة
            setHd(!hd);
          }}
        >
          <PixelIcon name="grid" />
          {labels.about.hd}
        </button>
      </figcaption>
    </figure>
  );
}
