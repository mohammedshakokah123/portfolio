# 02: الألوان والـ Tokens والثيم

## الهدف
ألوان مطابقة للتصميم بالثيمين، وتبديل Dark/Light بدون flash، والاختيار بينحفظ، وDark هو الافتراضي.

## الفكرة
التصميم الأصلي بيعمل Light mode عن طريق **قلب سلّم zinc** (zinc-950 بيصير أبيض، وwhite بيصير أسود...). هاد بيشتغل بس صعب تتابعه.
بدالها منستعمل **semantic tokens** تبع shadcn، يعني كل token إله قيمة بالـ dark وقيمة بالـ light، والمكونات بتستعمل اسم الـ token (`bg-background`) مش اللون (`bg-zinc-950`).

## جدول الربط (Design ← Token)

| بالتصميم (dark) | الاستخدام | Token | Dark | Light |
|-----------------|-----------|-------|------|-------|
| `bg-zinc-950` | خلفية الصفحة | `--background` | `#09090b` | `#ffffff` |
| `text-white` | العناوين | `--foreground` | `#ffffff` | `#09090b` |
| `text-zinc-300` | النص العادي | `--body` *(جديد)* | `#d4d4d8` | `#3f3f46` |
| `text-zinc-200` | نص مميز (dd، labels) | `--emphasis` *(جديد)* | `#e4e4e7` | `#27272a` |
| `text-zinc-400` | الفقرات | `--muted-foreground` | `#a1a1aa` | `#52525b` |
| `text-zinc-500` | نص ثانوي | `--subtle` *(جديد)* | `#71717a` | `#71717a` |
| `border-zinc-800` | الحدود | `--border` | `#27272a` | `#e4e4e7` |
| `border-zinc-700` | حدود الـ inputs والأزرار outline | `--input` | `#3f3f46` | `#d4d4d8` |
| `bg-zinc-900` | الـ chips والـ hover | `--muted` / `--accent` | `#18181b` | `#f4f4f5` |
| `bg-zinc-900/30` | الكروت | `--card` (مع `/30` أو `/40`) | `#18181b` | `#f4f4f5` |
| `bg-indigo-600` | الزر الأساسي | `--primary` | `#4f46e5` | `#4f46e5` |
| `text-indigo-50` | نص الزر الأساسي | `--primary-foreground` | `#eef2ff` | `#eef2ff` |
| `text-indigo-400` | الأيقونات والروابط | `--brand` *(جديد)* | `#818cf8` | `#4338ca` |
| `ring-indigo-400` | الـ focus | `--ring` | `#818cf8` | `#4f46e5` |
| `text-emerald-300` | Available / نجاح | `--success` *(جديد)* | `#6ee7b7` | `#047857` |
| `text-red-400` | الأخطاء | `--destructive` | `#f87171` | `#dc2626` |

> قيم الـ Light مأخوذة من الـ overrides بأول ملف التصميم (الأسطر 35 لـ 50) مشان يضل الـ contrast نفسه.

## الخطوات

### 1. `src/app/globals.css`
shadcn بيولّد الملف مع tokens بصيغة `oklch`. **استبدل القيم** بالقيم اللي فوق (Tailwind v4 بيقبل hex عادي)، وضيف الـ tokens الجديدة:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.5rem;
  --background: #ffffff;
  --foreground: #09090b;
  --body: #3f3f46;
  --emphasis: #27272a;
  --muted: #f4f4f5;
  --muted-foreground: #52525b;
  --subtle: #71717a;
  --border: #e4e4e7;
  --input: #d4d4d8;
  --card: #f4f4f5;
  --card-foreground: #09090b;
  --popover: #ffffff;
  --popover-foreground: #09090b;
  --primary: #4f46e5;
  --primary-foreground: #eef2ff;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --accent: #f4f4f5;
  --accent-foreground: #09090b;
  --brand: #4338ca;
  --success: #047857;
  --destructive: #dc2626;
  --ring: #4f46e5;
}

.dark {
  --background: #09090b;
  --foreground: #ffffff;
  --body: #d4d4d8;
  --emphasis: #e4e4e7;
  --muted: #18181b;
  --muted-foreground: #a1a1aa;
  --subtle: #71717a;
  --border: #27272a;
  --input: #3f3f46;
  --card: #18181b;
  --card-foreground: #ffffff;
  --popover: #09090b;
  --popover-foreground: #ffffff;
  --primary: #4f46e5;
  --primary-foreground: #eef2ff;
  --secondary: #18181b;
  --secondary-foreground: #e4e4e7;
  --accent: #18181b;
  --accent-foreground: #ffffff;
  --brand: #818cf8;
  --success: #6ee7b7;
  --destructive: #f87171;
  --ring: #818cf8;
}

@theme inline {
  /* ... الموجودين من shadcn ... */
  --color-body: var(--body);
  --color-emphasis: var(--emphasis);
  --color-subtle: var(--subtle);
  --color-brand: var(--brand);
  --color-success: var(--success);
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

@layer base {
  html {
    scroll-padding-top: 5rem;
  }
  @media (prefers-reduced-motion: no-preference) {
    html { scroll-behavior: smooth; }
  }
  body {
    @apply bg-background text-body antialiased selection:bg-primary/30 selection:text-foreground;
  }
}

@layer utilities {
  /* الـ grid تبع الـ placeholder (من التصميم) */
  .ph-grid {
    background-color: color-mix(in oklab, var(--muted) 60%, transparent);
    background-image:
      linear-gradient(to right, color-mix(in oklab, var(--input) 30%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in oklab, var(--input) 30%, transparent) 1px, transparent 1px);
    background-size: 24px 24px;
  }
}
```

هيك بتصير عندك classes متل: `text-body` و`text-emphasis` و`text-subtle` و`text-brand` و`text-success` و`bg-success/10` و`border-success/30`.

### 2. `src/components/providers/theme-provider.tsx`
```tsx
"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
```
> `storageKey="theme"`: نفس المفتاح تبع التصميم الأصلي.
> next-themes بيحقن سكريبت صغير قبل الـ paint، وهاد بيمنع الـ flash بدون ما نكتب سكريبت يدوي.

### 3. `src/app/layout.tsx` (الجزء المتعلق بالثيم)
```tsx
<html lang="en" suppressHydrationWarning>
  <body>
    <ThemeProvider>{children}</ThemeProvider>
  </body>
</html>
```
و`viewport`:
```ts
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "dark light",
};
```

### 4. `src/components/layout/theme-toggle.tsx`
- `"use client"`، ومنستعمل `useTheme()` من next-themes.
- زر shadcn: `variant="outline" size="icon"` مع class `size-9`.
- **مشكلة الـ hydration:** قبل الـ mount ما منعرف الثيم. الحل: منعرض الأيقونتين ومنخبّي وحدة بالـ CSS:
  ```tsx
  <Sun className="size-4 dark:block hidden" />
  <Moon className="size-4 dark:hidden block" />
  ```
- `aria-label`: منستعمل نص ثابت "Toggle theme"، أو ديناميكي بعد الـ mount ("Switch to light mode" / "Switch to dark mode").
- `onClick`: `setTheme(resolvedTheme === "dark" ? "light" : "dark")`.

### 5. تخصيص أزرار shadcn
بـ `src/components/ui/button.tsx` ضيف variant اسمه `inverted` (زر "View projects" الأبيض بالـ Hero):
```ts
inverted: "bg-foreground text-background hover:bg-foreground/85",
```
وخلّي الـ `outline` variant يطابق التصميم: `border-input text-emphasis hover:border-brand hover:text-foreground bg-transparent`.
الـ focus ring الافتراضي عند shadcn بيستعمل `--ring` = indigo، وهاد تمام.

## الملفات
`src/app/globals.css` و`src/components/providers/theme-provider.tsx` و`src/components/layout/theme-toggle.tsx` و`src/components/ui/button.tsx` (تعديل) و`src/app/layout.tsx`

## Definition of Done
- [ ] أول تحميل بالثيم الـ dark، وما في flash أبيض.
- [ ] التبديل بيشتغل وبينحفظ بعد الـ refresh.
- [ ] ما في hydration warnings بالـ console.
- [ ] صفحة تجربة صغيرة (مؤقتة) فيها `text-foreground` و`text-body` و`text-muted-foreground` و`text-brand` وأزرار shadcn: الألوان مطابقة للتصميم بالثيمين.
