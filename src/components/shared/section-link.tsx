"use client";

import Link from "next/link";

import { focusSection, isPlainLeftClick, sectionIdFromHref } from "@/lib/sections";

type SectionLinkProps = Omit<React.ComponentProps<typeof Link>, "href"> & {
  href: `/#${string}`;
  /**
   * إذا القسم مش موجود بالصفحة الحالية، منروح لهاد العنصر بنفس الصفحة بدل ما نتنقّل
   * للرئيسية (متل "Back to top" بالـ Footer ← "main" بصفحات المشاريع).
   */
  fallbackId?: string;
  /**
   * إذا انبعتت، هي اللي بتعمل scroll وfocus بالوقت اللي بيناسبها (متل قائمة الموبايل
   * اللي لازم تتسكّر أول). إذا لأ، منعمل focusSection فوراً.
   */
  onSectionNavigate?: (target: HTMLElement) => void;
};

/**
 * رابط لقسم بالرئيسية. إذا القسم موجود بالصفحة، منعمل متل التصميم: scroll وpushState
 * وfocus عالقسم (next/link بيعمل scroll بس، والـ focus بيضل عالرابط).
 * إذا مش موجود (متل صفحات المشاريع) أو الضغطة مع Ctrl/Cmd/Shift، منخلي الـ Link يشتغل عادي.
 */
export function SectionLink({
  href,
  onClick,
  fallbackId,
  onSectionNavigate,
  ...props
}: SectionLinkProps) {
  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!isPlainLeftClick(e)) return;

        const id = sectionIdFromHref(href);
        const section = document.getElementById(id);
        const target = section ?? (fallbackId ? document.getElementById(fallbackId) : null);
        if (!target) return;

        e.preventDefault();
        // الـ URL بيتغيّر بس إذا القسم نفسه موجود، ومع نفس الـ hash ما منضيف entry جديد بالـ history
        if (section && window.location.hash !== `#${id}`) {
          window.history.pushState(null, "", `#${id}`);
        }
        if (onSectionNavigate) onSectionNavigate(target);
        else focusSection(target);
      }}
      {...props}
    />
  );
}
