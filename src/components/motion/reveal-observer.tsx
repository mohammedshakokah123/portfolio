"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * IntersectionObserver واحد لكل عناصر الـ `Reveal` بالصفحة: لما العنصر يبين بيحطله `data-revealed`
 * (والـ CSS بيعمل الحركة) وبيوقف يراقبه، يعني الحركة مرة وحدة.
 * بالـ layout مع `pathname`: بعد كل navigation بيدوّر عالعناصر الجديدة.
 * الـ -80px من تحت: العنصر لازم يطلع شوي فوق أسفل الشاشة قبل ما يتحرك.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]:not([data-revealed])");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -80px 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
