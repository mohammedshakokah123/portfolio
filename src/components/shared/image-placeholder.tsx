import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  icon: React.ReactNode;
  label: string;
  /** إذا ما انبعت بياخد نفس الـ label (بكروت المشاريع بيجي من `project.placeholderLabel`) */
  ariaLabel?: string;
  /** خلفية الـ grid تبع screenshots المشاريع */
  grid?: boolean;
  className?: string;
};

/** بيعبّي الأب كامل (absolute inset-0)، فلازم الأب يكون relative ومساحته محجوزة (متل aspect-square) */
export function ImagePlaceholder({
  icon,
  label,
  ariaLabel = label,
  grid = false,
  className,
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn("absolute inset-0 grid place-items-center", grid && "ph-grid", className)}
    >
      <div className="text-subtle flex flex-col items-center gap-2">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
    </div>
  );
}
