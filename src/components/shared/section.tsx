import { cn } from "@/lib/utils";

type SectionProps = {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
  bordered?: boolean; // default true
};

/**
 * tabIndex={-1} مشان الـ focus يروح عالقسم بعد الانتقال بـ hash link (متل التصميم).
 * آخر قسم ما عليه border لحاله، لأن الـ Footer عليه border-t (وإلا بيطلع خط دبل).
 */
export function Section({ id, labelledBy, className, children, bordered = true }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={-1}
      className={cn(
        "focus:outline-none",
        bordered && "border-border/80 border-b last-of-type:border-b-0",
      )}
    >
      <div className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6", className)}>{children}</div>
    </section>
  );
}
