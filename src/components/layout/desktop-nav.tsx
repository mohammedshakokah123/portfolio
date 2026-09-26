"use client";

import { useMemo } from "react";

import { SectionLink } from "@/components/shared/section-link";
import { useActiveSection } from "@/hooks/use-active-section";
import { sectionIdFromHref } from "@/lib/sections";
import type { NavItem } from "@/types/content";

export function DesktopNav({ items }: { items: NavItem[] }) {
  const ids = useMemo(() => items.map((item) => sectionIdFromHref(item.href)), [items]);
  const active = useActiveSection(ids);

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-1 text-sm">
        {items.map((item, i) => (
          <li key={item.href}>
            <SectionLink
              href={item.href}
              aria-current={active === ids[i] ? "true" : undefined}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring aria-current:bg-muted aria-current:text-foreground rounded-md px-3 py-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              {item.label}
            </SectionLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
