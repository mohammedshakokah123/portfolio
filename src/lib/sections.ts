import type { MouseEvent } from "react";

/** "/#about" ← "about" (نفس الـ id تبع الـ <section>) */
export function sectionIdFromHref(href: `/#${string}`) {
  return href.slice(2);
}

/** متل التصميم: scroll للقسم وبعدين focus عليه بدون scroll تاني */
export function focusSection(target: HTMLElement) {
  target.scrollIntoView({ block: "start" });
  target.focus({ preventScroll: true });
}

/** ضغطة عادية (مش Ctrl/Cmd/Shift/Alt أو زر تاني) ← منتعامل معها نحنا، غير هيك منتركها للمتصفح */
export function isPlainLeftClick(e: MouseEvent) {
  return (
    !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey
  );
}
