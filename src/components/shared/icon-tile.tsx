import { cn } from "@/lib/utils";

/** مربع indigo خفيف حوالين أيقونة (نفس ألوان الـ TechBadge). الحجم الافتراضي للكروت، و"sm" جنب العناوين */
export function IconTile({
  children,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-primary/10 text-brand ring-primary/20 grid shrink-0 place-items-center rounded-md ring-1 ring-inset",
        size === "md" ? "size-9" : "size-7",
        className,
      )}
    >
      {children}
    </span>
  );
}
