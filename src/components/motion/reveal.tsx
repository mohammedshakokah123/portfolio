"use client";

import * as m from "motion/react-m";

// Map صريح بدل m[as]: الـ access الديناميكي على الـ namespace بيجيب كل عناصر motion (~170) للـ bundle
const tags = { div: m.div, li: m.li };

/** الفرق بين عنصرين بنفس الصف. ما منصدّره: الـ Server Components بتستورد من هاد الملف ("use client")،
 * وأي قيمة مش component بتوصلهن client reference مش رقم (يعني NaN بالحساب). */
const STAGGER = 0.07;

/**
 * fade-up مرة وحدة لما العنصر يدخل الشاشة.
 * بالقوائم كل عنصر بيراقب حالو (مش الـ container كله): عالموبايل العناصر تحت بعض، ولو الـ trigger
 * عالـ container بتخلص حركة العناصر اللي تحت قبل ما توصلها. الـ stagger بين العناصر اللي بنفس
 * الصف منعمله بـ `col` (رقم العمود = index % عدد الأعمدة).
 * data-reveal: الـ noscript والـ print بيرجّعوا العنصر ظاهر عن طريقه (شوف motion-noscript.tsx وglobals.css).
 */
export function Reveal({
  children,
  delay = 0,
  col = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  /** رقم العمود بالصف (0-based)، بيزيد تأخير خفيف بين عناصر نفس الصف */
  col?: number;
  className?: string;
  as?: keyof typeof tags;
}) {
  const Comp = tags[as];
  return (
    <Comp
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: delay + col * STAGGER }}
    >
      {children}
    </Comp>
  );
}
