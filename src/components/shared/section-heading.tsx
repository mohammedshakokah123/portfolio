type SectionHeadingProps = { id: string; title: string; description?: string };

export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <div>
      <h2 id={id} className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      {description && <p className="text-subtle mt-3 text-sm leading-relaxed">{description}</p>}
    </div>
  );
}
