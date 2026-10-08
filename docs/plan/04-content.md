# 04: المحتوى والأنواع

## الهدف
`src/content/` جاهز للتصميم الجديد: الأيقونات أسماء pixel بدل مكوّنات lucide، نصوص المراحل ("Player profile…"، "Inventory…")، والحقول الجديدة اللي التصميم بيحتاجها (stats، خريطة المسار، كلمات الـ pop، صورة الكارتريدج). وبآخرها `lucide-react` بتنشال.

## الفكرة
- **المحتوى الحقيقي بيضل متل ما هو.** الملف المرجعي فيه placeholders (مشاريع وهمية، إيميل `example.com`): مناخد منه **نصوص اللعبة** بس.
- **الأيقونة صارت نص** (`"mail"`) مش component. هيك المحتوى serializable، وبيتمرّق من Server لـ Client بدون مشاكل.
- **نصوص الواجهة الثابتة** (عناوين النوافذ، الشارات، رسائل اللعبة) بملف `labels.ts` لحاله، بدون أي import، فمسموح ينستورد من client components. (`site.ts` ممنوع: 00-overview، القاعدة 5.)

## جدول الربط: أيقونات lucide ← أيقونات الـ pixel

| وين | lucide (v1) | pixel |
|-----|-------------|-------|
| facts | `GraduationCap` / `Briefcase` / `CircleCheck` | `cap` / `briefcase` / `check` |
| abilities | `Layers` / `Gauge` / `Accessibility` | `layers` / `bolt` / `access` |
| skills | `Code` / `Palette` / `Database` / `Wrench` | `code` / `brush` / `database` / `wrench` |
| experience | `Briefcase` / `GraduationCap` | `briefcase` / `cap` |
| projects (placeholder) | `Megaphone` / `FlaskConical` / `Gem` | `chart` / `grid` / `cart` |

## الخطوات

### 1. `src/types/content.ts` (استبدل الملف كله)
```ts
import type { StageId } from "@/game/stages";
import type { ArtName } from "@/pixel/sprites/art";
import type { PixelIconName } from "@/pixel/sprites/icons";

/** نص فيه كلمات مميزة: كل جزء يا string عادي يا { emphasis } (بينعرض <strong>) */
export type RichText = (string | { emphasis: string })[];

/** chip بشاشة البداية. tone: "green" = الأيقونة خضرا (متل "Available") */
export type Fact = { icon: PixelIconName; text: string; tone?: "green" };

export type Stat = { label: string; value: string };

export type Ability = { icon: PixelIconName; title: string; description: string };

export type SiteConfig = {
  name: string;
  shortName: string; // بالـ HUD تحت 720px
  alternateNames: string[]; // طرق تانية لكتابة الاسم (إنجليزي/عربي) ← SEO
  role: string;
  url: string; // بدون "/" بالآخر
  description: string;
  ogDescription: string;
  keywords: string[]; // ← SEO
  email: string | null; // null = لسا ما وصل ← المكوّن بيخفيه
  location: string;
  cvPath: string;
  profileImage: string | null; // null = راس الشخصية الـ pixel
  availability: string;
  socials: {
    linkedin: string | null; // null = لسا ما وصل ← المكوّن بيخفيه
    github: string | null;
    others?: { label: string; url: string }[]; // X، Stack Overflow، dev.to...
  };
  /** السطر تحت عنوان كل مرحلة. العنوان نفسه من STAGE_NAMES */
  stageSubs: Record<Exclude<StageId, "home">, string>;
  home: {
    lead: string;
    sub: string;
    facts: Fact[];
  };
  about: {
    stats: Stat[];
    paragraphs: RichText[];
    abilities: Ability[];
  };
  footer: { credit: string };
};

export type SkillGroup = {
  title: string;
  icon: PixelIconName;
  items: string[];
  /** الكلمات اللي بتطلع (+React.js) لما تنكبس أيقونة المجموعة. أقصر من items مشان ما تطلع برّا الشاشة */
  pop: string[];
};

export type ExperienceItem = {
  title: string;
  org: string;
  /** "YYYY" أو "YYYY-MM" (بتنحط بـ <time dateTime>). end: null = لهلق ← شارة "Current quest" */
  period: { start: string; end: string | null };
  meta: { icon: PixelIconName; text: string };
  highlights: string[];
  tech?: string[];
};

/** محطة بخريطة المسار. next = المحطة الجاية: إطارها دهبي والشخصية واقفة عندها */
export type MapNode = {
  sprite: Extract<ArtName, "academy" | "office" | "diploma" | "flag">;
  year: string;
  label: string;
  next?: boolean;
};

export type Shot = { src: string; alt: string; caption: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string; // النص المختصر بالكارتريدج
  icon: PixelIconName; // أيقونة الـ placeholder لما ما في cover
  cover: { src: string; alt: string } | null; // صورة الكارتريدج (5:2). null = placeholder
  image: { src: string; alt: string } | null; // الصورة الرئيسية (16:10): أول صورة بمعرض المودال
  placeholderLabel: string; // aria-label للـ placeholder لما ما في cover
  tech: string[]; // tags الكارتريدج
  overview: string;
  architecture: string;
  features: string[];
  stack: string[];
  links: { demo?: string; source?: string };
  nda: boolean;
  accessNote?: string; // بيبدّل نص الشارة لما ما في روابط (متل "Client project, admin access only")
  gallery?: Shot[];
};
```
انشالوا: `NavItem`، `Cta`، `SectionIntro`، `QuickFact`، `GlanceItem`، `Principle`.

### 2. `src/content/labels.ts` (ملف جديد)
```ts
/**
 * نصوص الواجهة الثابتة: عناوين النوافذ، الأزرار، الشارات، ورسائل اللعبة.
 * ثوابت بس وبدون أي import، فمسموح تنستورد من client components.
 */
export const labels = {
  title: {
    start: "Press start",
    cv: "Download CV",
    contact: "Contact",
    facts: "Quick facts",
    hint: "Tip: use the arrow keys to switch stages. Click the character to jump.",
  },
  about: {
    bio: "Bio",
    abilities: "Abilities",
    hd: "HD photo",
  },
  experience: {
    map: "Career map",
    current: "Current quest",
    done: "Quest complete",
    tech: "Technologies used",
  },
  contact: {
    links: "Links",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Location",
    cv: "Download CV (PDF)",
    form: "Send a message",
    credits: "Thanks for playing",
    backToTitle: "Back to title",
    cvShort: "CV (PDF)",
  },
  pause: {
    title: "Paused",
    sub: "Select a stage",
    gems: "bonus gems found",
    resume: "Resume",
  },
  gems: {
    collect: "Collect bonus gem",
    title: "Bonus gems found",
    all: "All 5 gems found. Thanks for exploring!",
  },
} as const;
```

### 3. `src/content/site.ts`

**أ. الـ imports:** شيل سطر `lucide-react`. الباقي متل ما هو.

**ب. `resolveSiteUrl` والثوابت اللي فوق** (`name`، `role`، `availability`، `engineeringYears`، `contentUpdatedAt`): بدون تغيير.

**ج. الـ object `site`:** الحقول من `name` لـ `socials` متل ما هي، مع إضافة `shortName` بعد `name`:
```ts
  name,
  shortName: "M. Shaquqa",
```

**د. استبدل `nav` و`sections` و`hero` و`about` بهدول:**
```ts
  stageSubs: {
    about: "Player profile: who I am and how I work.",
    skills: "Inventory: the tools I use in production, grouped by where they sit in the stack.",
    experience: "Quest log: work and education, most recent first.",
    projects:
      "Business systems built for real operational needs. Pick a cartridge for the architecture details.",
    contact:
      "Save point. Hiring for a frontend or full-time software engineering role? Send a message and I'll reply within one business day.",
  },
  home: {
    lead: `${role} specializing in React, Next.js, and modern web applications.`,
    sub: `${engineeringYears} years of engineering experience delivering responsive user interfaces, integrating state management architectures, and building production-grade web systems.`,
    facts: [
      {
        icon: "cap",
        text: `Software Engineering Graduate (${university.org}, ${formatPeriod(university.period)})`,
      },
      {
        icon: "briefcase",
        text: `${formatYears(productionYears)} production experience at ${davinda.org}`,
      },
      { icon: "check", text: availability, tone: "green" },
    ],
  },
  about: {
    stats: [
      { label: "Main stack", value: "React, Next.js, TypeScript" },
      { label: "State & data", value: "Zustand, Redux, TanStack Query" },
      {
        label: "XP",
        value: `${engineeringYears} years total, ${formatYearCount(productionYears)} in production`,
      },
      { label: "Base", value: "Latakia, Syria" },
      { label: "Open to", value: "Full-time, on-site or remote" },
    ],
    paragraphs: [
      // الفقرتين الموجودين متل ما هم (مع { emphasis })
    ],
    abilities: [
      {
        icon: "layers",
        title: "Maintainable architecture",
        description: "Typed components, clear state boundaries, and folder structures that scale.",
      },
      {
        icon: "bolt",
        title: "Performance by default",
        description: "Code splitting, request caching, and avoiding needless re-renders.",
      },
      {
        icon: "access",
        title: "Accessible interfaces",
        description: "Semantic HTML, keyboard support, and accessible component primitives.",
      },
    ],
  },
```
`footer` متل ما هو.

| من v1 | صار | ملاحظة |
|-------|-----|--------|
| `nav` | انحذف | روابط الـ HUD من `STAGES` و`STAGE_NAMES` |
| `sections.*.title` | انحذف | العناوين من `STAGE_NAMES` (About، Skills…) |
| `sections.*.description` | `stageSubs` | بنص اللعبة من المرجع (الأسطر 1503، 1570، 1627، 1700، 1778). نص Contact = "Save point. " + نص v1 |
| `hero.title` / `hero.lead` | `home.lead` / `home.sub` | نفس النصين (المرجع 1477–1478) |
| `hero.quickFacts` | `home.facts` | نفس الـ 3، بأيقونات pixel |
| `hero.ctas` | انحذف | أزرار شاشة البداية ثابتة: Press start، Download CV، Contact |
| `hero.glance` | `about.stats` | بتسميات المرجع (1527–1531). "Role" انشال (موجود تحت الاسم)، وانضاف "Base" |
| `about.principles` | `about.abilities` | نفس الـ 3 |

### 4. `src/content/skills.ts` (استبدل الملف كله)
```ts
import type { SkillGroup } from "@/types/content";

export const skills: readonly SkillGroup[] = [
  {
    title: "Frontend frameworks",
    icon: "code",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "Semantic Web"],
    pop: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "Semantic Web"],
  },
  {
    title: "UI & styling",
    icon: "brush",
    items: ["Tailwind CSS", "CSS3", "Responsive Design", "Radix UI", "Component Libraries"],
    pop: ["Tailwind CSS", "CSS3", "Responsive", "Radix UI", "Components"],
  },
  {
    title: "State & data fetching",
    icon: "database",
    items: ["Zustand", "Redux Toolkit", "TanStack Query", "Axios", "RESTful APIs", "WebSockets"],
    pop: ["Zustand", "Redux Toolkit", "TanStack Query", "Axios", "REST", "WebSockets"],
  },
  {
    title: "Tools & ecosystem",
    icon: "wrench",
    items: ["Git", "GitHub", "Vite", "AI-augmented workflows", "Figma inspection"],
    pop: ["Git", "GitHub", "Vite", "AI workflows", "Figma"],
  },
];

/**
 * الـ 3 blocks العائمين بمرحلة Skills (بيبينوا من 1600px وطالع). كل كبسة بتطلّع الكلمة اللي بعدها.
 * من المرجع (الأسطر 1456–1458).
 */
export const worldBlocks: readonly (readonly string[])[] = [
  ["React.js", "Next.js", "TypeScript", "JavaScript"],
  ["Tailwind CSS", "Radix UI", "CSS3", "Responsive"],
  ["Zustand", "Redux Toolkit", "TanStack Query", "WebSockets"],
];
```
> الـ `pop` من المرجع (الأسطر 1576، 1587، 1597، 1608).

### 5. `src/content/experience.ts`

**أ.** شيل سطر `lucide-react`، وعدّل الـ import تبع التواريخ والأنواع:
```ts
import { formatYears, yearsBetween } from "@/lib/dates";
import type { ExperienceItem, MapNode } from "@/types/content";
```

**ب.** الأيقونتين:
```ts
// جوّا davinda
meta: { icon: "briefcase", text: "Full-time, production engineering" },
// جوّا university
meta: { icon: "cap", text: "Faculty of Information Engineering" },
```

**ج.** ضيف بآخر الملف (بعد `productionYears`):
```ts
/**
 * خريطة المسار فوق الـ quests: 3 محطات من البيانات ومحطة "الجاية" (الشركة اللي عم تقرأ).
 * الـ sprites من src/pixel/sprites/art.ts.
 */
export const careerMap: readonly MapNode[] = [
  { sprite: "academy", year: university.period.start, label: `Started B.Sc. at ${university.org}` },
  { sprite: "office", year: formatYears(productionYears), label: `${davinda.title} at ${davinda.org}` },
  {
    sprite: "diploma",
    year: university.period.end ?? "In progress",
    label: "Graduated in Software Engineering",
  },
  { sprite: "flag", year: "Next stage", label: "Your team", next: true },
];
```

> ⏳ **Davinda:** `period.end` هلق `"2026-09"`، فشارتها رح تطلع "Quest complete". المرجع كاتب "Current quest". إذا لسا شغّال هنيك غيّرها لـ `null` (وانتبه: `productionYears` بيحسب من `end`، فوقتها لازم يتعدّل الحساب لتاريخ اليوم).

### 6. `src/content/projects.ts`

**أ.** شيل سطر `lucide-react`.

**ب.** لكل مشروع: بدّل الـ `icon` وضيف `cover` قبل `image`:

| المشروع (`slug`) | `icon` | `cover.src` | `cover.alt` |
|------------------|--------|-------------|-------------|
| `classifieds-admin-dashboard` | `"chart"` | `` `${sooqSuria}/00-cover.webp` `` | `"Three overlapping browser windows of the SooqSuria admin dashboard: the KPI dashboard in dark mode, the Arabic right-to-left view, and the ads management table"` |
| `klardent-dental-lab-saas` | `"grid"` | `` `${klardent}/00-cover.webp` `` | `"Three overlapping browser windows of the Klardent dental lab platform: case details in dark mode, the Arabic dashboard, and the create new case form"` |
| `chloellia-jewellery-storefront` | `"cart"` | `` `${chloellia}/00-cover.webp` `` | `"Three overlapping browser windows of the Chloéllia storefront: the about page, the Arabic home page, and the English home page with a sapphire ring"` |

مثال:
```ts
    icon: "chart",
    cover: {
      src: `${sooqSuria}/00-cover.webp`,
      alt: "Three overlapping browser windows of the SooqSuria admin dashboard: the KPI dashboard in dark mode, the Arabic right-to-left view, and the ads management table",
    },
    image: {
      // متل ما هي
    },
```
> صور `00-cover.webp` موجودة من قبل (1920×768، يعني 5:2) ومش مستعملة بـ v1.

**ج.** `projectLabels`: ضيف سطر واحد (اسم الصورة الرئيسية لما تنحط أول المعرض)، واحذف `getAdjacentProjects` (كانت لروابط Previous/Next بصفحة المشروع):
```ts
  overviewShot: "Overview",
```
`getAllProjects` و`getProjectBySlug` بيضلوا.

### 7. `src/lib/seo/json-ld.ts`
احذف `projectJsonLd` والـ import تبع `Project` (كانت لصفحات المشاريع). المشاريع بترجع للـ JSON-LD تبع الرئيسية بالمرحلة 09.

### 8. شيل lucide
```bash
git grep -n "lucide-react" -- src    # لازم يرجّع فاضي
npm uninstall lucide-react
```

## الملفات
`src/types/content.ts`، `src/content/labels.ts` (جديد)، `src/content/{site,skills,experience,projects}.ts`، `src/lib/seo/json-ld.ts`، `package.json`

## Definition of Done
- [x] `npm run lint && npm run build` ناجحين (الأنواع بتلقط أي اسم أيقونة غلط: جرّب `icon: "rocket"` وشوف الخطأ، ورجّعها).
- [x] `git grep "lucide-react"` بيرجّع فاضي بكل المشروع (ما عدا `package-lock.json` قبل الـ uninstall).
- [x] الـ 3 مشاريع فيهم `cover` بـ alt وصفي، وملفات الصور موجودة بـ `public/projects/*/00-cover.webp`.
- [x] `careerMap` بيطلّع: `2020` ← `1.5 years` ← `2026` ← `Next stage`.
- [x] `src/content/labels.ts` ما فيه ولا `import`.
- [x] الصفحة المؤقتة و`/kit` لسا بيشتغلوا.

## ملاحظات التنفيذ
- **ما في شي تغيّر عن الخطة.** التعديلات انعملت بسكربت بياخد النصوص من هالملف (الـ code blocks وجدول الـ covers)، وكل استبدال لازم يطابق مرة وحدة بالضبط، وإلا بيوقف قبل ما يكتب شي.
- **`overviewShot`** انحط بـ `projectLabels` بعد `gallery`.
- **فحص الـ DoD:** `icon: "rocket"` طلّع `TS2322` من `tsc` ورجع نضيف بعد ما انشالت. `careerMap` والـ covers انفحصوا بتحميل ملفات `src/content/` بـ Node مباشرة.
- **Davinda** لسا `end: "2026-09"` (مستني قرار صاحب الموقع، شوف الـ README).
