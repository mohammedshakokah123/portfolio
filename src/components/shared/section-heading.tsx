import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id: string;
  title: string;
  description?: string;
  className?: string;
  /** لقسم وصفه أكبر من العادي (متل Contact: text-base بلون أفتح) */
  descriptionClassName?: string;
};

export function SectionHeading({
  id,
  title,
  description,
  className,
  descriptionClassName,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      {/* خط قصير بيعلّم بداية القسم، وبينرسم لليمين لما يبين الـ Reveal (القواعد بـ globals.css) */}
      <span
        aria-hidden
        data-reveal-line
        className="bg-brand mb-4 block h-0.5 w-8 origin-left rounded-full [--reveal-scale-from:0_1]"
      />
      <h2 id={id} className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && (
        <p className={cn("text-subtle mt-3 text-sm leading-relaxed", descriptionClassName)}>
          {description}
        </p>
      )}
    </div>
  );
}
