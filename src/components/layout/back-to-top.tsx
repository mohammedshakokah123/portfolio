"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

import { SectionLink } from "@/components/shared/section-link";
import { cn } from "@/lib/utils";

/**
 * زر "Back to top" عائم، بيبين بعد ما تنزل أكتر من شاشة تقريباً. نفس رابط الـ Footer (scroll وfocus
 * عالـ Hero، أو عالـ main بصفحات المشاريع). وهو مخفي `inert`: ما بياخد focus ولا بينضغط.
 * الـ ResizeObserver بيعمل أول فحص بعد الـ layout (متل use-active-section)، مشان إذا الصفحة
 * فتحت بالنص (رجوع أو reload) يبين من الأول.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    return () => {
      window.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  return (
    <SectionLink
      href="/#top"
      fallbackId="main"
      inert={!visible}
      className={cn(
        "border-input bg-background/80 text-emphasis hover:border-brand hover:text-foreground focus-visible:ring-ring fixed right-4 bottom-4 z-30 grid size-11 place-items-center rounded-full border shadow-lg shadow-black/10 backdrop-blur transition-[opacity,translate,border-color,color] duration-300 ease-out focus-visible:ring-2 focus-visible:outline-none sm:right-6 sm:bottom-6 print:hidden",
        !visible && "pointer-events-none translate-y-2 opacity-0 motion-reduce:translate-y-0",
      )}
    >
      <ArrowUp className="size-5" aria-hidden />
      <span className="sr-only">Back to top</span>
    </SectionLink>
  );
}
