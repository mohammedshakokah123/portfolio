"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * بيرجّع الـ id تبع القسم اللي بنص الشاشة (نفس الـ rootMargin تبع التصميم).
 * - منحفظ كل الأقسام اللي بالشريط هلق، ومنميّز آخر واحد منهم بترتيب الصفحة. إذا ما في ولا واحد
 *   (متل لما ترجع للـ Hero) منشيل التمييز.
 * - بآخر الصفحة منميّز آخر قسم، لأن القسم القصير بالآخر (Contact) ممكن ما يوصل لنص الشاشة أبداً.
 * مرّر `ids` ثابتة (معرّفة برّا المكوّن أو بـ useMemo) مشان ما يعيد الـ effect كل render.
 */
export function useActiveSection(ids: readonly string[]) {
  // الـ Header ما بيعمل remount بين الصفحات، فمنربط الـ observer بالـ pathname:
  // كل صفحة جديدة منرجع ندوّر على أقسامها، ومنمسح التمييز القديم.
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  // آخر قسم موجود إذا وصلنا لآخر الصفحة، وإلا null
  const [bottomId, setBottomId] = useState<string | null>(null);
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setActive(null);
    setBottomId(null);
  }

  useEffect(() => {
    // منرتّبهم حسب مكانهم بالصفحة، مش حسب ترتيب الـ nav
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (!sections.length) return;
    const lastId = sections[sections.length - 1].id;

    // الشريط رفيع والأقسام لازقة ببعض، فممكن يكون فيه قسمين بنفس الوقت. القسم اللي بيضل
    // جوّا ما بيبعت أي entry جديد، فلازم نتذكّر مين جوّا بدل ما نعتمد عآخر entry بس.
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const { isIntersecting, target } of entries) {
          if (isIntersecting) inBand.add(target.id);
          else inBand.delete(target.id);
        }
        setActive(sections.findLast((s) => inBand.has(s.id))?.id ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    // 2px سماحية لأن الـ scrollY ممكن يكون كسر بالشاشات اللي فيها zoom
    const checkBottom = () =>
      setBottomId(
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
          ? lastId
          : null,
      );
    window.addEventListener("scroll", checkBottom, { passive: true });
    window.addEventListener("resize", checkBottom, { passive: true });
    // طول الصفحة ممكن يتغيّر بدون scroll (صورة تحمّلت، محتوى انفتح). الـ ResizeObserver
    // كمان بيعمل أول فحص بعد الـ layout، مش قبله.
    const ro = new ResizeObserver(checkBottom);
    ro.observe(document.body);

    return () => {
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", checkBottom);
      window.removeEventListener("resize", checkBottom);
    };
  }, [ids, pathname]);

  return bottomId ?? active;
}
