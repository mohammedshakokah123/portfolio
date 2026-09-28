import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
  bordered?: boolean; // default true
  /** خلفية أغمق/أفتح بدرجة (Skills وProjects) مشان يصير للصفحة إيقاع */
  band?: boolean;
  /** طبقة زينة بعرض الشاشة كلها ورا المحتوى (absolute، لازم يكون عليها -z-10 وaria-hidden) */
  backdrop?: React.ReactNode;
};

/**
 * tabIndex={-1} مشان الـ focus يروح عالقسم بعد الانتقال بـ hash link (متل التصميم).
 * آخر قسم ما عليه border لحاله، لأن الـ Footer عليه border-t (وإلا بيطلع خط دبل).
 */
export function Section({
  id,
  labelledBy,
  className,
  children,
  bordered = true,
  band = false,
  backdrop,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={cn(
        "focus:outline-none",
        bordered && "border-border/80 border-b last-of-type:border-b-0",
        band && "bg-band",
        backdrop && "relative isolate",
      )}
    >
      {backdrop}
      <div className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6", className)}>{children}</div>
    </section>
  );
}
