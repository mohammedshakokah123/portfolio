"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * بيرجّع الـ id تبع القسم اللي بنص الشاشة (نفس الـ rootMargin تبع التصميم).
 * مرّر `ids` ثابتة (معرّفة برّا المكوّن أو بـ useMemo) مشان ما يعيد الـ effect كل render.
 */
export function useActiveSection(ids: readonly string[]) {
  // الـ Header ما بيعمل remount بين الصفحات، فمنربط الـ observer بالـ pathname:
  // كل صفحة جديدة منرجع ندوّر على أقسامها، ومنمسح التمييز القديم.
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActive(null);
  }

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids, pathname]);

  return active;
}
