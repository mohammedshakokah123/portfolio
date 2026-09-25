# 05: قسم Hero وقسم About

**المرجع:** `design/reference.html` الأسطر 199 لـ 295.

## الهدف
أول شي بيشوفه الزائر: مطابق للتصميم بالضبط، وبدون أي layout shift، وسريع (LCP).

## Hero: `src/components/sections/hero.tsx`

### البنية
```
<section id="top" aria-labelledby="hero-title" className="border-b border-border/80">
  <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[1fr_20rem] lg:items-center">
    <div>
      AvailabilityBadge
      h1#hero-title
      p.lead
      ul[aria-label="Quick facts"] ← 3 عناصر
      CTA buttons
    </div>
    <GlanceCard />
  </div>
</section>
```
> الـ Hero ما بيستعمل `Section` لأن الـ padding والـ grid تبعه مختلفين.

### التفاصيل
1. **Availability badge**: shadcn `Badge` مع classes مخصصة:
   ```tsx
   <Badge variant="outline" className="mb-5 gap-2 rounded-full border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
     <span className="size-1.5 rounded-full bg-success" aria-hidden /> {site.availability}
   </Badge>
   ```
   > الـ Badge بيطلع `<span>`، والتصميم كان `<p>`. الأحسن تلفّه بـ `<p>` أو تعمل `asChild`.
2. **h1 (مع الاسم لأجل الـ SEO):** بالتصميم الأصلي الـ h1 ما فيه الاسم، وهاد بيضعّف الظهور لما حدا يبحث عن اسمك. الحل: منحط الاسم **جوّا الـ h1** كسطر صغير فوق الجملة، والشكل بيضل نفسه تقريباً:
   ```tsx
   <h1 id="hero-title" className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]">
     <span className="mb-3 block text-base font-medium tracking-normal text-brand sm:text-lg">
       {site.name}
     </span>
     {site.hero.title}
   </h1>
   ```
   هيك Google بيقرأ الـ h1 هيك: "Mohammad Shaquqa Frontend Engineer specializing in…".
3. **Lead**: `mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground`
4. **Quick facts**: `li` بـ `inline-flex items-center gap-2 rounded-md border border-border bg-muted/60 px-3 py-1.5 text-body` مع أيقونة `size-4 text-brand`.
5. **CTA**:
   - `<Button asChild variant="inverted" size="lg"><a href={primary.href}>{primary.label}</a></Button>`
   - `<Button asChild variant="outline" size="lg"><a href={secondary.href}>{secondary.label}</a></Button>`
   - (`const { primary, secondary } = site.hero.ctas;`)
   - الارتفاع `h-11 px-5`.

## GlanceCard: جوّا `hero.tsx` أو ملف منفصل
```tsx
<aside aria-label="At a glance" className="w-full max-w-sm overflow-hidden rounded-lg border border-border bg-card/40 lg:max-w-none">
  <figure className="relative aspect-square border-b border-border bg-muted">
    {site.profileImage ? (
      <Image src={site.profileImage} alt={site.name} fill priority
             sizes="(min-width: 1024px) 20rem, 24rem" className="object-cover" />
    ) : (
      <ImagePlaceholder icon={<User className="size-14" />} label="Profile photo" />
    )}
  </figure>
  <dl className="divide-y divide-border text-sm">
    {site.hero.glance.map(({ label, value }) => (
      <div key={label} className="flex justify-between gap-4 px-5 py-3.5">
        <dt className="text-subtle">{label}</dt>
        <dd className="text-right text-emphasis">{value}</dd>
      </div>
    ))}
  </dl>
</aside>
```
- **`priority`** (أو `preload` بـ Next 16): الصورة غالباً هي الـ LCP.
- `aspect-square` + `fill`: المساحة محجوزة، فما في layout shift.
- التصميم كان بيعمل `onerror="this.remove()"`. هون منستعمل `profileImage: null` بـ `site.ts` لحد ما تحط الصورة بـ `public/profile.jpg`.

## ImagePlaceholder: `src/components/shared/image-placeholder.tsx`
```tsx
export function ImagePlaceholder({ icon, label, ariaLabel = label, grid = false, className }: {
  icon: React.ReactNode; label: string; ariaLabel?: string; grid?: boolean; className?: string;
}) {
  return (
    <div role="img" aria-label={ariaLabel}
         className={cn("absolute inset-0 grid place-items-center", grid && "ph-grid", className)}>
      <div className="flex flex-col items-center gap-2 text-subtle">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
    </div>
  );
}
```
(بينستعمل كمان بكروت المشاريع مع `grid`، والـ `ariaLabel` بيجي من `project.placeholderLabel`.)

## About: `src/components/sections/about.tsx`
```tsx
<Section id="about" labelledBy="about-title" className="grid gap-10 lg:grid-cols-[16rem_1fr]">
  <h2 id="about-title" className="text-2xl font-semibold tracking-tight text-foreground">{site.sections.about.title}</h2>
  <div className="max-w-3xl space-y-5 text-base leading-relaxed text-muted-foreground">
    {site.about.paragraphs.map((p, i) => <RichTextParagraph key={i} text={p} />)}
    <ul className="grid gap-3 pt-2 sm:grid-cols-3">
      {site.about.principles.map(({ icon: Icon, title, description }) => (
        <li key={title} className="rounded-lg border border-border p-4">
          <Icon className="size-5 text-brand" aria-hidden />
          <p className="mt-3 text-sm font-medium text-emphasis">{title}</p>
          <p className="mt-1 text-sm text-subtle">{description}</p>
        </li>
      ))}
    </ul>
  </div>
</Section>
```
> **`RichTextParagraph`** (بـ `shared/`): بيلف كل جزء `{ emphasis }` بـ `<span className="text-emphasis">`، والـ string بيعرضه متل ما هو:
> ```tsx
> <p>{text.map((seg, i) => typeof seg === "string" ? seg : <span key={i} className="text-emphasis">{seg.emphasis}</span>)}</p>
> ```

## `src/app/page.tsx`
```tsx
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      {/* Skills, Experience, Projects, Contact بالمراحل الجاية */}
    </>
  );
}
```

## Definition of Done
- [ ] مطابقة بصرية (جنب لجنب مع `design/reference.html`) على 320px و768px و1280px بالثيمين.
- [ ] الـ Placeholder بيبيّن إذا `profileImage = null`، والصورة بتبيّن إذا موجودة، وما في shift بالحالتين.
- [ ] الـ CTA بتنزل للأقسام بـ smooth scroll.
- [ ] ما في نصوص hard-coded (كله من `site`).
- [ ] أزرار الـ CTA بتستعمل `SectionLink` (مش `Link` عادي) مشان الـ focus يروح عالقسم.
- [ ] (من مرحلة 04) الـ Active nav: شيل الأقسام المؤقتة من `page.tsx`، وتأكد إنه قسم Contact بيتميّز لما تنزلله، وإنه التمييز بينشال لما ترجع للـ Hero. إذا لأ، صلّح `useActiveSection`.
