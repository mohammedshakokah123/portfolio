"use client";

import { useEffect, useMemo, useRef } from "react";

import { SectionLink } from "@/components/shared/section-link";
import { useActiveSection } from "@/hooks/use-active-section";
import { sectionIdFromHref } from "@/lib/sections";
import type { NavItem } from "@/types/content";

export function DesktopNav({ items }: { items: NavItem[] }) {
  const ids = useMemo(() => items.map((item) => sectionIdFromHref(item.href)), [items]);
  const active = useActiveSection(ids);
  const navRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);

  // خط تحت رابط القسم الحالي بيتزحلق من رابط لرابط. منحرّكه بالـ style مباشرة (بدون state) لأنه شكل بس.
  // الـ nav هو الـ offsetParent (relative)، والـ ResizeObserver بيعيد الحساب إذا تغيّر عرض الروابط.
  useEffect(() => {
    const nav = navRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    const place = () => {
      const link = nav.querySelector<HTMLElement>("[aria-current]");
      if (!link) {
        indicator.style.opacity = "0";
        return;
      }
      // أول ما يبين (من الـ Hero مثلاً) بيطلع بمكانه بـ fade بس، بدون ما يتزحلق من مكانه القديم
      indicator.style.transitionProperty = indicator.style.opacity === "1" ? "" : "opacity";
      indicator.style.opacity = "1";
      // تحت النص بس، مش تحت الـ padding تبع الرابط
      const inset = parseFloat(getComputedStyle(link).paddingLeft);
      indicator.style.translate = `${link.offsetLeft + inset}px 0`;
      indicator.style.width = `${link.offsetWidth - inset * 2}px`;
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(nav);
    return () => ro.disconnect();
  }, [active]);

  return (
    <nav ref={navRef} aria-label="Primary" className="relative hidden md:block">
      <ul className="flex items-center gap-1 text-sm">
        {items.map((item, i) => (
          <li key={item.href}>
            <SectionLink
              href={item.href}
              aria-current={active === ids[i] ? "true" : undefined}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-current:text-foreground block rounded-md px-3 py-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </SectionLink>
          </li>
        ))}
      </ul>
      <span
        ref={indicatorRef}
        aria-hidden
        className="bg-brand pointer-events-none absolute bottom-0.5 left-0 h-0.5 w-0 rounded-full opacity-0 transition-[translate,width,opacity] duration-300 ease-out motion-reduce:transition-none"
      />
    </nav>
  );
}
