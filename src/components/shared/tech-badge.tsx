import { cn } from "@/lib/utils";

/** الـ badge البنفسجي تبع التقنيات (بالـ Experience والمشاريع). لازم يكون جوّا <ul> */
export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <li className="bg-primary/10 text-brand ring-primary/20 rounded px-2 py-0.5 text-xs ring-1 ring-inset">
      {children}
    </li>
  );
}

export function TechList({
  items,
  label = "Technologies",
  className,
}: {
  items: readonly string[];
  label?: string;
  className?: string;
}) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((t) => (
        <TechBadge key={t}>{t}</TechBadge>
      ))}
    </ul>
  );
}
