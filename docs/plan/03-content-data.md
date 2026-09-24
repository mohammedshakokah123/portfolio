# 03: فصل المحتوى (Content Layer)

## الهدف
كل النصوص والروابط والبيانات تكون بملفات TypeScript typed بـ `src/content/`، والمكونات بس بتعرضها. هيك تعديل أي معلومة (إيميل، مشروع جديد...) بيصير بمكان واحد.

## الخطوات

### 1. `src/types/content.ts`
```ts
import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: `/#${string}` };

export type QuickFact = { icon: LucideIcon; text: string };

export type GlanceItem = { label: string; value: string };

export type Principle = { icon: LucideIcon; title: string; description: string };

export type SiteConfig = {
  name: string;
  alternateNames: string[]; // طرق تانية لكتابة الاسم (إنجليزي/عربي) ← SEO
  role: string;
  url: string;
  description: string;
  keywords: string[]; // ← SEO
  email: string;
  location: string;
  cvPath: string;
  profileImage: string | null; // null = يعرض placeholder
  availability: string;
  socials: {
    linkedin: string;
    github: string;
    others?: { label: string; url: string }[]; // X، Stack Overflow، dev.to...
  };
  nav: NavItem[];
  hero: {
    title: string;
    lead: string;
    quickFacts: QuickFact[];
    glance: GlanceItem[];
  };
  about: {
    paragraphs: string[]; // ممكن فيها <strong> ← منستعمل ReactNode أو markdown بسيط
    principles: Principle[];
  };
  contact: { intro: string };
};

export type SkillGroup = { title: string; icon: LucideIcon; items: string[] };

export type ExperienceItem = {
  title: string;
  org: string;
  period: { label: string; start?: string; end?: string }; // start/end للـ <time dateTime>
  meta: { icon: LucideIcon; text: string };
  current: boolean;
  highlights: string[];
  tech?: string[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string; // النص المختصر بالكرت
  icon: LucideIcon; // أيقونة الـ placeholder
  image: string | null; // "/projects/pos.webp"
  imageAlt: string;
  tech: string[]; // badges الكرت
  overview: string;
  architecture: string;
  features: string[];
  stack: string[];
  links: { demo?: string; source?: string };
  nda: boolean;
};
```

> **ملاحظة:** الأيقونات (`LucideIcon`) بتنعرض بس جوّا **Server Components**. إذا احتجت تبعت شي لمكوّن client، ابعته كـ `children` مش كـ prop.

> **فقرة About الثانية** فيها كلمة `Davinda` مميزة (`text-zinc-200`). أبسط حل: `paragraphs: React.ReactNode[]` والملف يصير `site.tsx`، أو تخلي كلمة الشركة `highlight` منفصلة. اختار الأول (`site.tsx`).

### 2. `src/content/site.tsx`
انقل **حرفياً** من `design/reference.html`:
- الاسم: `Mohammad Shaquqa`، الدور: `Frontend Engineer`
- الـ description من `<meta name="description">`
- الإيميل والروابط (هلق placeholders، وبتنعدل بمرحلة 11)
- `location`: `Latakia, Syria, open to remote and relocation`
- `cvPath`: `/cv/Mohammad-Shaquqa-CV.pdf`
- `nav`: About و Skills و Experience و Projects و Contact ← `/#about`...
- `hero.title` و`hero.lead` و3 quick facts (GraduationCap، Briefcase، CircleCheck)
- `hero.glance`: Role، Core stack، State & data، Experience، Open to
- `about.paragraphs` و3 principles (Layers، Gauge، Accessibility)
- `contact.intro`

```ts
export const site: SiteConfig = {
  name: "Mohammad Shaquqa",
  // TODO(SEO): أكّد كل طرق كتابة الاسم اللي ممكن حدا يبحث فيها
  alternateNames: ["محمد شقوقة" /* , "Mohammad Shakokah", "Mohammed Shaquqa" ... */],
  role: "Frontend Engineer",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  keywords: [
    "Mohammad Shaquqa", "Frontend Engineer", "Frontend Developer",
    "React Developer", "Next.js Developer", "TypeScript", "Latakia", "Syria",
  ],
  socials: {
    linkedin: "TODO: رابط LinkedIn الحقيقي",
    github: "TODO: رابط GitHub الحقيقي",
    others: [], // TODO: أي حسابات تانية (X، Stack Overflow...)
  },
  // ...
};
```

> **كل الروابط اللي عليها `TODO`** رح يبعتها صاحب الموقع لاحقاً. لحد وقتها خليها placeholders، ولا تعتمد على الروابط التخمينية اللي بالتصميم.

### 3. `src/content/skills.ts`
4 مجموعات بنفس الترتيب: Frontend frameworks (`Code`)، UI & styling (`Palette`)، State & data fetching (`Database`)، Tools & ecosystem (`Wrench`).

### 4. `src/content/experience.ts`
عنصرين: Frontend Developer at Davinda (`current: true` مع tech badges)، وB.Sc. in Software Engineering at Latakia University (2020 لـ 2026).

### 5. `src/content/projects.ts`
4 مشاريع، **الـ slugs**:

| slug | العنوان | icon | nda |
|------|---------|------|-----|
| `pos-inventory` | POS & Inventory Management System | `ScanBarcode` | true |
| `ecommerce-platform` | E-Commerce Platform | `ShoppingCart` | false |
| `operations-dashboard` | Real-time Operations Dashboard | `LayoutDashboard` | true |
| `ui-component-library` | Internal UI Component Library | `Component` | false |

انقل كل النصوص من الـ `<template id="tpl-...">` (الأسطر 663 لـ 798 بالمرجع): الـ subtitle والـ overview والـ architecture والـ features والـ stack.

```ts
export const projects: Project[] = [ /* ... */ ];

export function getAllProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string) {
  const i = projects.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? projects[i - 1] : null,
    next: i < projects.length - 1 ? projects[i + 1] : null,
  };
}
```

## الملفات
`src/types/content.ts` و`src/content/site.tsx` و`src/content/skills.ts` و`src/content/experience.ts` و`src/content/projects.ts`

## Definition of Done
- [ ] كل النصوص من المرجع منقولة بدون ما ينقص شي (قارن قسم بقسم).
- [ ] `npx tsc --noEmit` بدون أخطاء.
- [ ] ما في ولا نص hard-coded رح يكون بمكونات `sections/` (بتتأكد منها بالمراحل الجاية).
