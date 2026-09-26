/** الفرق بين عنصرين بنفس الصف (ثانية) */
const STAGGER = 0.07;

/**
 * fade-up مرة وحدة لما العنصر يدخل الشاشة. Server Component: ما بيبعت JS، بس بيحط `data-reveal`
 * والـ delay كـ CSS variable. الحركة نفسها بالـ CSS (globals.css)، و`RevealObserver` (واحد للصفحة كلها)
 * بيحط `data-revealed` لما العنصر يبين.
 * بالقوائم كل عنصر بيراقب حالو (مش الـ container كله): عالموبايل العناصر تحت بعض، ولو الـ trigger
 * عالـ container بتخلص حركة العناصر اللي تحت قبل ما توصلها. الـ stagger بين العناصر اللي بنفس
 * الصف منعمله بـ `col` (رقم العمود = index % عدد الأعمدة).
 */
export function Reveal({
  children,
  delay = 0,
  col = 0,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  /** رقم العمود بالصف (0-based)، بيزيد تأخير خفيف بين عناصر نفس الصف */
  col?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const totalDelay = delay + col * STAGGER;
  return (
    <Tag
      data-reveal
      className={className}
      style={
        totalDelay ? ({ "--reveal-delay": `${totalDelay}s` } as React.CSSProperties) : undefined
      }
    >
      {children}
    </Tag>
  );
}
