# 00: نظرة عامة

## الهدف
تحويل التصميم الموجود (`Index (1).html`، ملف واحد مع Tailwind Play CDN و JavaScript عادي) لتطبيق **Next.js App Router** مع **TypeScript** و**Tailwind CSS v4** و**shadcn/ui**، مع حركات خفيفة بـ **Motion** (framer-motion سابقاً)، بشرط نحافظ على نفس الشكل ونفس مستوى الـ accessibility.

## تحليل التصميم

### الأقسام (بالترتيب)
| القسم | `id` | الملاحظات |
|------|------|-----------|
| Header | - | sticky، فيه backdrop-blur، اسم + دور، nav، زر ثيم، زر CV، وقائمة موبايل |
| Hero | `top` | badge "Available"، h1، وصف، quick facts، زرّين CTA، وبطاقة "At a glance" فيها صورة و`<dl>` |
| About | `about` | فقرتين و3 كروت مبادئ |
| Skills | `skills` | 4 مجموعات مهارات بـ grid متلاصق (`gap-px`) |
| Experience | `experience` | timeline (`<ol>` مع `border-l`) |
| Projects | `projects` | 4 كروت ← **صفحة مستقلة لكل مشروع** (بدل المودال) |
| Contact | `contact` | روابط تواصل + فورم مع validation |
| Footer | - | حقوق + روابط |

### الألوان
- **Neutral:** سلّم `zinc` (الخلفية zinc-950، النصوص zinc-300/400/500، الحدود zinc-800).
- **Accent:** `indigo` (الزر الأساسي indigo-600، الأيقونات والـ badges indigo-400/300، الـ focus ring indigo-400).
- **Status:** `emerald` لـ "Available" ولرسالة النجاح، و`red` للأخطاء.
- **Dark هو الافتراضي**، والـ Light اختياري وبينحفظ.

### الـ Layout
- الـ container: `mx-auto max-w-6xl px-4 sm:px-6`.
- كل قسم: `py-20` مع `border-b`.
- أغلب الأقسام: `lg:grid-cols-[16rem_1fr]` (العنوان بعمود جانبي والمحتوى جنبه).
- الـ Hero: `lg:grid-cols-[1fr_20rem]`.
- الـ Contact: `lg:grid-cols-[1fr_1.3fr]`.

## الـ Stack

| الأداة | الاستخدام |
|-------|-----------|
| Next.js (latest, App Router) | الإطار، SSG للصفحات |
| TypeScript (strict) | الأنواع |
| Tailwind CSS v4 | التنسيق |
| shadcn/ui (Radix) | Button، Badge، Card، Sheet، Input، Textarea، Label، Field، Separator، Sonner |
| `motion` | الحركات (`motion/react`) |
| `next-themes` | Dark/Light بدون flash |
| `lucide-react` | الأيقونات (نفس أيقونات التصميم) |
| `zod` + `react-hook-form` | الـ validation تبع الفورم |
| `resend` | إرسال الإيميل من الـ Server Action |

## هيكل المجلدات النهائي

```
portfolio/
├── design/
│   └── reference.html            ← التصميم الأصلي (مرجع)
├── docs/plan/                    ← هي الخطة
├── public/
│   ├── profile.jpg               ← الصورة الشخصية (640x640 أو أكبر)
│   ├── cv/Mohammad-Shaquqa-CV.pdf
│   └── projects/*.webp           ← screenshots المشاريع (1280x800)
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── not-found.tsx
    │   ├── icon.svg
    │   ├── opengraph-image.tsx
    │   ├── sitemap.ts
    │   ├── robots.ts
    │   ├── actions/contact.ts
    │   └── projects/[slug]/{page.tsx, opengraph-image.tsx}
    ├── components/
    │   ├── ui/                   ← مكونات shadcn (ما منعدّل عليها إلا للضرورة)
    │   ├── layout/               ← site-header, desktop-nav, mobile-nav, theme-toggle, site-footer, skip-link
    │   ├── sections/             ← hero, about, skills, experience, projects, contact
    │   ├── projects/             ← project-card, project-detail
    │   ├── contact/              ← contact-form
    │   ├── motion/               ← motion-provider, reveal, stagger, hover-lift
    │   ├── shared/               ← section, section-heading, tech-badge, image-placeholder, brand-icons, json-ld
    │   └── providers/            ← theme-provider
    ├── content/                  ← site.tsx, skills.ts, experience.ts, projects.ts
    ├── hooks/                    ← use-active-section.ts
    ├── lib/                      ← utils.ts, validations/contact.ts, seo/json-ld.ts
    └── types/                    ← content.ts
```

## الـ Conventions

- **Server Components بشكل افتراضي.** منحط `"use client"` بس على المكونات التفاعلية: `theme-toggle` و`mobile-nav` و`desktop-nav` (active state) و`contact-form` ومكونات `motion/`.
- **Client wrappers بياخدوا `children` بس**، يعني ما منمرّق مكونات (متل أيقونات lucide) من server لـ client كـ props، لأنها مش serializable.
- **المحتوى منفصل عن الـ UI:** ما في نصوص hard-coded جوّا `sections/`، وكل شي بييجي من `src/content/`.
- **الأسماء:** الملفات kebab-case (`site-header.tsx`)، والمكونات PascalCase (`SiteHeader`)، وnamed exports للمكونات، و`default export` بس للـ pages والـ layouts.
- **الـ classes:** دايماً منستعمل الـ semantic tokens (`bg-background` و`text-muted-foreground` و`border-border`) بدل ألوان zinc مباشرة، مشان الثيمين يشتغلوا (التفاصيل بملف 02).
- **`cn()`** من `@/lib/utils` لدمج الـ classes.
- **Accessibility:** منحافظ على كل شي موجود بالتصميم: skip link، `aria-labelledby`، `aria-current`، `sr-only`، `focus-visible:ring`، و`aria-live` للفورم.
