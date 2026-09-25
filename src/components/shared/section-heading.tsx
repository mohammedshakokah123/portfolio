type SectionHeadingProps = { id: string; title: string; description?: string; className?: string };

export function SectionHeading({ id, title, description, className }: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 id={id} className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && <p className="text-subtle mt-3 text-sm leading-relaxed">{description}</p>}
    </div>
  );
}
