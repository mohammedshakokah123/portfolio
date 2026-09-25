"use client";

import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SectionLink } from "@/components/shared/section-link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { focusSection, isPlainLeftClick } from "@/lib/sections";
import type { NavItem } from "@/types/content";

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  // القسم اللي انضغط رابطه. منعمله focus بس لما القائمة تتسكّر كلياً (بعد الـ animation)،
  // لأنه قبل هيك Radix بيكون حاطط aria-hidden على باقي الصفحة ومسكّر الـ scroll.
  const pendingSectionRef = useRef<HTMLElement | null>(null);

  // لما تكبر الشاشة لـ md الزر بيختفي، فمنسكّر القائمة متل التصميم
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="size-9 md:hidden">
          <Menu className="size-5" aria-hidden="true" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="top"
        className="pt-16"
        onCloseAutoFocus={(e) => {
          const target = pendingSectionRef.current;
          if (!target) return; // Escape أو زر الإغلاق أو navigation عادي ← الـ focus بيرجع للزر
          pendingSectionRef.current = null;
          e.preventDefault();
          focusSection(target);
        }}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile">
          <ul className="space-y-1 px-4 pb-4 text-sm sm:px-6">
            {items.map((item) => (
              <li key={item.href}>
                <SectionLink
                  href={item.href}
                  onClick={(e) => {
                    // Ctrl/Cmd+Click بيفتح تاب جديد، فالقائمة بتضل مفتوحة متل أي رابط عادي
                    if (isPlainLeftClick(e)) setOpen(false);
                  }}
                  onSectionNavigate={(target) => {
                    pendingSectionRef.current = target;
                  }}
                  className="text-body hover:bg-muted hover:text-foreground focus-visible:ring-ring block rounded-md px-3 py-2.5 focus-visible:ring-2 focus-visible:outline-none"
                >
                  {item.label}
                </SectionLink>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
