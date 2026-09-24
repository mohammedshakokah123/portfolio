# 06: قسم Skills وقسم Experience

**المرجع:** `design/reference.html` الأسطر 297 لـ 423.

## TechBadge: `src/components/shared/tech-badge.tsx`
الـ badge البنفسجي اللي بينستعمل بالـ Experience والمشاريع:
```tsx
export function TechBadge({ children }: { children: React.ReactNode }) {
  return (
    <li className="rounded bg-primary/10 px-2 py-0.5 text-xs text-brand ring-1 ring-inset ring-primary/20">
      {children}
    </li>
  );
}

export function TechList({ items, label = "Technologies", className }: {
  items: string[]; label?: string; className?: string;
}) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((t) => <TechBadge key={t}>{t}</TechBadge>)}
    </ul>
  );
}
```
> بما إنه لازم يكون `<li>` جوّا `<ul>`، ما منستعمل shadcn Badge هون. الـ classes أبسط من إنها تحتاج مكوّن.

## Skills: `src/components/sections/skills.tsx`
```tsx
<Section id="skills" labelledBy="skills-title" className="grid gap-10 lg:grid-cols-[16rem_1fr]">
  <SectionHeading id="skills-title" title="Technical skills"
    description="Tools I use in production, grouped by where they sit in the stack." />

  <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
    {skillGroups.map(({ title, icon: Icon, items }) => (
      <article key={title} className="bg-background p-6">
        <h3 className="flex items-center gap-2.5 text-sm font-semibold text-foreground">
          <Icon className="size-4 text-brand" aria-hidden /> {title}
        </h3>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm">
          {items.map((s) => (
            <li key={s} className="rounded-md border border-border bg-muted px-2.5 py-1 text-body">{s}</li>
          ))}
        </ul>
      </article>
    ))}
  </div>
</Section>
```
> **حيلة الـ `gap-px`:** الخلفية تبع الـ grid هي لون الـ border، والفراغ اللي عرضه 1px بين الكروت بيبان كخط فاصل.

## Experience: `src/components/sections/experience.tsx`
```tsx
<Section id="experience" labelledBy="experience-title" className="grid gap-10 lg:grid-cols-[16rem_1fr]">
  <SectionHeading id="experience-title" title="Experience & education" description="Most recent first." />

  <ol className="relative border-l border-border">
    {experience.map((item, i) => (
      <li key={item.title} className={cn("relative pl-8", i < experience.length - 1 && "pb-12")}>
        <span aria-hidden className={cn(
          "absolute -left-[7px] top-1.5 size-3 rounded-full border-2 bg-background",
          item.current ? "border-brand" : "border-subtle",
        )} />
        <article>
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <h3 className="text-lg font-semibold text-foreground">
              {item.title} <span className="font-normal text-subtle">at</span> {item.org}
            </h3>
            <p className="text-sm text-subtle">{/* period ← <time dateTime=...> */}</p>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-subtle">
            <item.meta.icon className="size-3.5" aria-hidden /> {item.meta.text}
          </p>
          <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-muted-foreground">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-subtle" />
                {h}
              </li>
            ))}
          </ul>
          {item.tech && <TechList items={item.tech} label="Technologies used" className="mt-5" />}
        </article>
      </li>
    ))}
  </ol>
</Section>
```
- **الـ Period:** Davinda: `<time>1.5+ years</time>, current`، والجامعة: `<time dateTime="2020">2020</time> – <time dateTime="2026">2026</time>`. اعمل helper صغير `PeriodLabel` بيقرأ `period`.
- ملاحظة: `<item.meta.icon />` ما بيشتغل مباشرة بـ JSX. اعمل `const MetaIcon = item.meta.icon;` قبل الـ return.

## ضيفهم لـ `page.tsx`
```tsx
<Hero /> <About /> <Skills /> <Experience />
```

## Definition of Done
- [ ] الـ Skills grid بخطوط فاصلة رفيعة، وعمود واحد على الموبايل وعمودين من `sm`.
- [ ] الـ Timeline: الخط والنقاط بمكانهم بالضبط، ونقطة indigo للحالي ورمادية للباقي.
- [ ] Semantic HTML: `ol` و`article` و`time`.
- [ ] مطابقة بصرية بالثيمين.
