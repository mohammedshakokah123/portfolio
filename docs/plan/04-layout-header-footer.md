# 04: الـ Layout والـ Header والـ Footer

## الهدف
الهيكل الثابت لكل الصفحات: Skip link، Header (sticky) مع nav للـ desktop وقائمة للموبايل، `<main>`، وFooter. ومعهم مكونات `Section` و`SectionHeading` اللي رح تستعملها كل الأقسام.

**المرجع:** `design/reference.html` الأسطر 143 لـ 195 (header) و629 لـ 641 (footer) و828 لـ 878 (JS).

## الخطوات

### 1. `src/app/layout.tsx`
```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <MotionProvider>
            <SkipLink />
            <SiteHeader />
            <main id="main" tabIndex={-1} className="focus:outline-none">
              {children}
            </main>
            <SiteFooter />
            <Toaster />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```
> `MotionProvider` بيجي بمرحلة 09، ولهلق خليه pass-through (`<>{children}</>`).

### 2. `src/components/layout/skip-link.tsx`
```tsx
<a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground">
  Skip to content
</a>
```

### 3. `src/components/layout/site-header.tsx` (Server Component)
```
<header className="sticky top-0 z-40 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
  <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
    Logo: <Link href="/#top"> الاسم | الدور </Link>
    <DesktopNav items={site.nav} />          ← hidden md:block
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Button asChild size="sm"><a href={site.cvPath} download> <Download/> Download CV (PDF) / CV </a></Button>
      <MobileNav items={site.nav} />          ← md:hidden
    </div>
  </div>
</header>
```
- نص زر الـ CV: `hidden sm:inline` لـ "Download CV (PDF)" و`sm:hidden` لـ "CV" (متل التصميم).

### 4. `src/hooks/use-active-section.ts`
```ts
"use client";
import { useEffect, useState } from "react";

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);

  return active;
}
```
> مرّر `ids` كثابت معرّف برّا المكوّن (أو `useMemo`) مشان ما يعيد الـ effect كل render.

### 5. `src/components/layout/desktop-nav.tsx` (`"use client"`)
- `<nav aria-label="Primary">` ← `<ul>` ← `<Link>` لكل عنصر.
- `aria-current={active === id ? "true" : undefined}`.
- الـ classes: `rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground aria-[current=true]:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`.
- مكان الـ indicator المتحرك (`layoutId`) بيجي بمرحلة 09.
- على صفحات المشاريع (`/projects/...`) ما في sections، فـ `active` بيضل `null`، وهاد سلوك طبيعي.

### 6. `src/components/layout/mobile-nav.tsx` (`"use client"`)
منستعمل **shadcn Sheet** بدل القائمة اليدوية، فالـ Escape والـ focus trap والـ scroll lock ورجعة الـ focus كلهم جاهزين:
```tsx
const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button variant="outline" size="icon" className="size-9 md:hidden">
      <Menu className="size-5" />
      <span className="sr-only">Open menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent side="top" className="pt-16">
    <SheetHeader className="sr-only"><SheetTitle>Navigation</SheetTitle></SheetHeader>
    <nav aria-label="Mobile">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-body hover:bg-muted hover:text-foreground">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </SheetContent>
</Sheet>
```
- لما تكبر الشاشة لـ `md` بتتسكّر القائمة (بالتصميم فيه `matchMedia`). الـ Sheet بيضل مفتوح بس الزر بيختفي، فضيف `useEffect` مع `matchMedia("(min-width: 768px)")` بيعمل `setOpen(false)`.

### 7. التنقل بين الأقسام
- الروابط كلها `/#section`، فبتشتغل من الرئيسية ومن صفحات المشاريع.
- الـ smooth scroll و`scroll-padding-top` صاروا بالـ CSS (مرحلة 02).
- **Focus بعد الانتقال:** التصميم كان بيعمل focus على الـ section. منضيف `tabIndex={-1}` على كل `<section>` (عن طريق مكوّن `Section`)، والمتصفح بيعمل focus على الـ target لحاله مع hash links. إذا ما صار هيك مع `next/link`، استعمل `<a>` عادي للروابط الداخلية بالصفحة الرئيسية.

### 8. `src/components/shared/section.tsx`
```tsx
type SectionProps = {
  id: string;
  labelledBy: string;
  className?: string;
  children: React.ReactNode;
  bordered?: boolean; // default true
};

export function Section({ id, labelledBy, className, children, bordered = true }: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} tabIndex={-1}
      className={cn("focus:outline-none", bordered && "border-b border-border/80")}>
      <div className={cn("mx-auto max-w-6xl px-4 py-20 sm:px-6", className)}>{children}</div>
    </section>
  );
}
```

### 9. `src/components/shared/section-heading.tsx`
```tsx
export function SectionHeading({ id, title, description }: { id: string; title: string; description?: string }) {
  return (
    <div>
      <h2 id={id} className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
      {description && <p className="mt-3 text-sm leading-relaxed text-subtle">{description}</p>}
    </div>
  );
}
```

### 10. `src/components/layout/site-footer.tsx`
- `© {new Date().getFullYear()} {site.name}. {site.footer.credit}`
- روابط LinkedIn وGitHub بس إذا مش `null` (`site.socials.linkedin && …`).
- `<nav aria-label="Footer">`: Back to top (`/#top`)، CV (PDF) (download)، LinkedIn، GitHub (`target="_blank" rel="noopener noreferrer"`).
- الـ classes: `border-t border-border/80` و`text-sm text-subtle` و`hover:text-emphasis`.

## Definition of Done
- [ ] الـ Header ثابت فوق مع blur، ومطابق للتصميم على 375px و768px و1280px.
- [ ] الـ Active nav بيتغيّر مع الـ scroll (منجرّبه بعد ما نضيف الأقسام).
- [ ] قائمة الموبايل: بتفتح وبتتسكّر بالـ Escape وبالضغط على رابط، والـ focus بيرجع للزر.
- [ ] الـ Skip link بيبيّن بأول Tab.
- [ ] الـ Footer مع السنة الحالية.
