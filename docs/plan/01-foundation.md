# 01: الأساس (الـ branch، الحذف، الخطوط، الـ tokens، الـ boot script)

## الهدف
مشروع نضيف من واجهة v1، فيه خطين التصميم والـ tokens والـ CSS الأساسي، وحالة الصفحة (المرحلة، النهار/الليل، الجواهر) بتنحط عالـ `<html>` **قبل أول paint**. بآخر المرحلة الصفحة بتعرض نص تجريبي بس، بدون أي مرحلة.

## الفكرة
- الشغل كله على branch جديد. التصميم الأول بيضل على `main`، فما في داعي نخلّي ملفاته هون.
- منحذف الواجهة القديمة **من أول مرحلة**، مش بالآخر: `next build` بيفحص أنواع كل ملفات `src/` حتى اللي مش مستوردة، فأي ملف قديم بيعتمد على حزمة انشالت بيوقّف الـ build.
- ملفات الـ CSS الـ 16 بتنخلق **كلها هلق** (أغلبها فاضي مع تعليق)، و`globals.css` بيستوردها بالترتيب النهائي مرة وحدة. كل مرحلة بعدين بتعبّي ملفها وما بتلمس `globals.css`.

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 15–17 (روابط Google Fonts) | `next/font/google` بـ `src/app/layout.tsx` |
| 28–44 (stage، time، intro) | `src/game/boot.ts` |
| 679–715 (TOKENS) | `src/styles/pixel/tokens.css` |
| 720–748 (BASE + `.skip`) | `src/styles/pixel/base.css` |
| 1308–1343 (RESPONSIVE) | `src/styles/pixel/responsive.css` |
| 1348–1388 (KEYFRAMES + reduced motion) | `src/styles/pixel/keyframes.css` |
| 1393 (skip link) | `src/components/layout/skip-link.tsx` |
| 2062–2065 (`store`) | `src/game/persist.ts` |

## الخطوات

### 1. الـ branch
```bash
git switch -c feat/pixel-art
```

### 2. حذف الواجهة القديمة
```bash
git rm -r src/app/projects \
  src/components/ui src/components/motion src/components/providers \
  src/components/sections src/components/projects src/components/contact src/components/layout \
  src/hooks/use-active-section.ts src/lib/sections.ts components.json

git rm src/components/shared/{section,section-heading,section-link,hash-focus,image-placeholder,tech-badge,icon-tile,brand-icons,lazy-toaster,rich-text-paragraph}.tsx
```
بيضل بـ `src/components/shared/`: `json-ld.tsx` و`new-tab-hint.tsx`.

> `contact-form.tsx` و`project-gallery.tsx` بيرجعوا بالمرحلتين 10 و09 بنسخة جديدة. النسخة القديمة مرجع للمنطق: `git show main:src/components/contact/contact-form.tsx`.

### 3. الحزم
```bash
npm uninstall next-themes sonner radix-ui shadcn class-variance-authority tw-animate-css
```
`lucide-react` بتضل لهلق: ملفات `src/content/` لسا بتستورد منها (بتنشال بالمرحلة 04).

### 4. `src/app/sitemap.ts`
صفحات المشاريع راحت، فبيضل رابط واحد:
```ts
import type { MetadataRoute } from "next";

import { contentUpdatedAt, site } from "@/content/site";

// تاريخ ثابت مش new Date(): غير هيك كل build بيقول لـ Google "كل شي تغيّر"، ومع الوقت بيتجاهل الـ lastModified
const lastModified = new Date(contentUpdatedAt);

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified, changeFrequency: "monthly", priority: 1 }];
}
```
> `projectJsonLd` بـ `src/lib/seo/json-ld.ts` بيضل لهلق بدون استعمال. بينحذف بالمرحلة 04، والمشاريع بترجع للـ JSON-LD تبع الرئيسية بالمرحلة 09.

### 5. ملفات الـ CSS

اخلق المجلد `src/styles/pixel/` وفيه الـ 16 ملف. أربعة بيتعبّوا هلق، والباقي فيهم سطر تعليق واحد (`/* المرحلة 03 */` مثلاً).

#### `tokens.css` ← الأسطر 679–715
انقل الـ `:root` وقاعدة `[data-time="night"]` والـ `@media (max-width: 719px)` متل ما هم، مع تعديل واحد على الخطين (أسماء المتغيرات من `next/font`، الخطوة 7):
```css
  --f-pixel: var(--font-press-start), ui-monospace, Menlo, Consolas, monospace;
  --f-body: var(--font-pixelify), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
```

#### `base.css` ← الأسطر 720–748
انقل من `*, *::before, *::after` لحد `.skip:focus`، مع هالتعديلات:

| التعديل | السبب |
|---------|-------|
| `h1, h2, h3 {` ← `h1, h2, h3, h4 {` | مستويات العناوين نزلت درجة (00-overview)، وصار في `h4` |
| احذف قاعدة `.sr-only` | منستعمل `sr-only` تبع Tailwind (نفس النتيجة) |
| احذف قاعدة `[hidden]` | موجودة بالـ preflight |

الـ `.ico` (750–757) **مش هون**: بتروح لـ `kit.css` بالمرحلة 03.

#### `responsive.css` ← الأسطر 1308–1343
انقل الـ 3 media queries متل ما هم، بدون أي تعديل. القواعد لعناصر لسا ما انبنت ما بتأثر على شي.

#### `keyframes.css` ← الأسطر 1348–1388
كل الـ `@keyframes` وقاعدة `prefers-reduced-motion` متل ما هم.

### 6. `src/app/globals.css`
استبدل الملف كله:
```css
@import "tailwindcss";

/* الترتيب = ترتيب الأقسام بـ design/pixel art.html. في قواعد بنفس الـ specificity وبيغلب فيها اللي بيجي
   بالآخر (متل `.win` بالـ responsive فوق `.modal-win`)، فلا تغيّر الترتيب.
   tokens وkeyframes بدون layer. الباقي بـ base أو components، يعني تحت الـ utilities تبع Tailwind. */
@import "../styles/pixel/tokens.css";
@import "../styles/pixel/base.css" layer(base);
@import "../styles/pixel/kit.css" layer(components);
@import "../styles/pixel/hud.css" layer(components);
@import "../styles/pixel/world.css" layer(components);
@import "../styles/pixel/stages.css" layer(components);
@import "../styles/pixel/home.css" layer(components);
@import "../styles/pixel/about.css" layer(components);
@import "../styles/pixel/skills.css" layer(components);
@import "../styles/pixel/experience.css" layer(components);
@import "../styles/pixel/projects.css" layer(components);
@import "../styles/pixel/contact.css" layer(components);
@import "../styles/pixel/ground-bar.css" layer(components);
@import "../styles/pixel/overlays.css" layer(components);
@import "../styles/pixel/responsive.css" layer(components);
@import "../styles/pixel/keyframes.css";

/* tokens التصميم كـ utilities: font-pixel، font-body، text-gold، bg-panel... للحالات القليلة اللي بدها utility */
@theme inline {
  --font-pixel: var(--f-pixel);
  --font-body: var(--f-body);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-panel: var(--panel);
  --color-panel-2: var(--panel-2);
  --color-panel-3: var(--panel-3);
  --color-gold: var(--gold);
  --color-teal: var(--teal);
  --color-muted: var(--muted);
  --color-paper: var(--paper);
}
```

**شو بيغيّر الـ preflight تبع Tailwind عن المرجع** (المرجع بدون reset):

| الـ preflight | الأثر | الحل |
|--------------|-------|------|
| `a { text-decoration: inherit }` | الروابط بدون underline | بس `.credit-links a` بيعتمد عالـ underline الافتراضي ← بينضاف صريح بالمرحلة 10 |
| `* { margin: 0; padding: 0; border: 0 solid }` | الـ `<dialog>` بيفقد `margin: auto` | المرجع كاتب `dialog.modal { margin: auto }` صريح، فما في شي |
| `html { -webkit-tap-highlight-color: transparent }` | ما في وميض عند اللمس عالموبايل | مقبول (المرجع شايله عن `.btn` بس) |
| `h1…h6 { font-size: inherit }` | - | كل عناوين التصميم إلها `font-size` صريح |

### 7. الخطوط والـ layout: `src/app/layout.tsx`
```tsx
import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";

import { GameRoot } from "@/components/game/game-root";
import { SkipLink } from "@/components/layout/skip-link";
import { site } from "@/content/site";
import { bootScript } from "@/game/boot";
import { defaultTitle, sharedOpenGraph, sharedTwitter } from "@/lib/seo/metadata";

import "./globals.css";

// self-hosted: ما في request لـ Google. الـ variable بتنحط عالـ <html> وبتنقرأ بـ tokens.css
const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
  display: "swap",
});
// خط variable (400–700): التصميم بيستعمل 400 و500 و600
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  variable: "--font-pixelify",
  display: "swap",
});

export const metadata: Metadata = {
  // نفس الـ metadata تبع v1 بالحرف (metadataBase، title، description، keywords، openGraph، twitter، robots، verification)
};

export const viewport: Viewport = {
  themeColor: "#14142B", // النهار. المحرك بيبدّلها لـ #0E1236 بالليل (المرحلة 05)
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // القيم الافتراضية (home، day) هي اللي بيشوفها اللي مطفّي الـ JS. الـ boot script بيصححها قبل أول paint،
    // فالـ DOM بيختلف عن اللي React متوقعه ← suppressHydrationWarning
    <html
      lang="en"
      data-stage="home"
      data-time="day"
      className={`${pressStart.variable} ${pixelify.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <SkipLink />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <GameRoot />
      </body>
    </html>
  );
}
```
> الـ `metadata` ما بتتغيّر: خلّي الـ object الموجود متل ما هو (بما فيه التعليق عن الـ canonical).
> أسماء المتغيرات `--font-press-start` و`--font-pixelify` مختلفة عن `--font-pixel` و`--font-body` تبع `@theme` بقصد، مشان ما يصير تعريف دائري.

### 8. `src/components/layout/skip-link.tsx`
```tsx
export function SkipLink() {
  return (
    <a className="skip" href="#main">
      Skip to content
    </a>
  );
}
```

### 9. `src/game/stages.ts`
```ts
export const STAGES = ["home", "about", "skills", "experience", "projects", "contact"] as const;

export type StageId = (typeof STAGES)[number];

/** الاسم القصير: بالـ HUD، بالـ ground bar، وبعنوان المرحلة */
export const STAGE_NAMES: Record<StageId, string> = {
  home: "Title",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  contact: "Contact",
};

/** جوهرة وحدة بكل مرحلة ما عدا شاشة البداية */
export const GEM_IDS = ["about", "skills", "experience", "projects", "contact"] as const;

export type GemId = (typeof GEM_IDS)[number];

export function isStageId(value: string): value is StageId {
  return (STAGES as readonly string[]).includes(value);
}

/** "#about" أو "about" ← "about". أي شي تاني (فاضي، غلط، encoding خربان) ← "home" */
export function stageFromHash(hash: string): StageId {
  let id = hash.replace(/^#/, "");
  try {
    id = decodeURIComponent(id);
  } catch {
    /* hash مش صالح ← home */
  }
  return isStageId(id) ? id : "home";
}
```

### 10. `src/game/persist.ts`
```ts
/** نفس مفاتيح الملف المرجعي وصيغها */
export const KEYS = { time: "ms-time", sound: "ms-sound", gems: "ms-gems" } as const;

/** للقيم المخزّنة JSON (ms-sound وms-gems). أي خطأ (storage مسكّر، JSON خربان) ← fallback */
export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}

/** ms-time نص خام ("day" / "night") مش JSON، متل المرجع */
export function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeRaw(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked */
  }
}
```

### 11. `src/game/boot.ts`
```ts
import { KEYS } from "./persist";
import { GEM_IDS, STAGES } from "./stages";

/**
 * بيحط حالة الصفحة عالـ <html> قبل أول paint: data-js، data-stage (من الـ hash)، data-time، data-gems، data-intro.
 *
 * ⚠️ self-contained: الـ function بتتحوّل لنص بـ toString() وبتتنفّذ inline بالـ <head>، فممنوع تستعمل جوّاها
 * أي import أو متغيّر من برّاها. كل شي بيلزمها بيوصلها كـ argument.
 */
export function boot(
  stages: readonly string[],
  gemIds: readonly string[],
  timeKey: string,
  gemsKey: string,
  intro: boolean,
) {
  const root = document.documentElement;
  root.setAttribute("data-js", "");

  let hash = location.hash.slice(1);
  try {
    hash = decodeURIComponent(hash);
  } catch {
    /* hash مش صالح ← home */
  }
  const stage = stages.includes(hash) ? hash : "home";
  root.setAttribute("data-stage", stage);

  let time: string | null = null;
  try {
    time = localStorage.getItem(timeKey);
  } catch {
    /* storage blocked */
  }
  if (time !== "day" && time !== "night") {
    time = matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
  }
  root.setAttribute("data-time", time);

  let saved: unknown = [];
  try {
    saved = JSON.parse(localStorage.getItem(gemsKey) ?? "[]");
  } catch {
    /* storage blocked أو JSON خربان */
  }
  const list: unknown[] = Array.isArray(saved) ? saved : [];
  root.setAttribute("data-gems", gemIds.filter((id) => list.includes(id)).join(" "));

  // حركة الحروف بشاشة البداية: بس عند فتح الصفحة على home، وبدون reduced motion
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (intro && stage === "home" && !reduce) root.setAttribute("data-intro", "");
}

const ARGS = [STAGES, GEM_IDS, KEYS.time, KEYS.gems] as const;

/** نص الـ <script> بالـ layout */
export const bootScript = `(${boot.toString()})(${[...ARGS, true].map((a) => JSON.stringify(a)).join(",")})`;

/**
 * بالـ dev، الـ Strict Mode بيعمل remount وبيرجّع <html> للـ attributes اللي React بيعرفها بس، فبيمسح
 * اللي حطها السكربت. GameRoot بينادي هي بـ useLayoutEffect ليرجّعها. بالـ production ما بتغيّر شي.
 * الـ intro بترجع بس إذا الصفحة لسا عم تفتح (أول 2.6 ثانية، مدة الحركة).
 */
export function reapplyBoot() {
  boot(...ARGS, performance.now() < 2600);
}
```

### 12. `src/components/game/game-root.tsx`
```tsx
"use client";

import { useLayoutEffect } from "react";

import { reapplyBoot } from "@/game/boot";

/** نقطة الوصل بين React والمحرك. هلق بس بيرجّع attributes الـ <html>، والمرحلة 06 بتضيف تشغيل المحرك */
export function GameRoot() {
  useLayoutEffect(() => {
    reapplyBoot();
  }, []);

  return null;
}
```

### 13. صفحة مؤقتة: `src/app/page.tsx`
```tsx
import type { Metadata } from "next";

import { JsonLd } from "@/components/shared/json-ld";
import { site } from "@/content/site";
import { homeJsonLd } from "@/lib/seo/json-ld";
import { defaultTitle, sharedOpenGraph } from "@/lib/seo/metadata";

// الـ title والـ description والـ twitter من الـ layout. الـ openGraph كامل هون لأن الدمج shallow
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...sharedOpenGraph,
    type: "profile",
    url: "/",
    title: defaultTitle,
    description: site.ogDescription,
    firstName: "Mohammad",
    lastName: "Shaquqa",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      {/* مؤقت: بينشال بالمرحلة 06 */}
      <div style={{ padding: "120px 20px", display: "grid", gap: 16 }}>
        <h1 style={{ fontSize: 28, color: "#fff", textShadow: "var(--o3)" }}>Pixel foundation</h1>
        <p style={{ color: "var(--ink)" }}>Body text in Pixelify Sans 400.</p>
        <p style={{ color: "var(--ink)", fontWeight: 600 }}>Body text in Pixelify Sans 600.</p>
      </div>
    </>
  );
}
```

### 14. `src/app/not-found.tsx` (مؤقت، الشكل النهائي بالمرحلة 12)
```tsx
import type { Metadata } from "next";
import Link from "next/link";

// الـ robots صريح: غير هيك بيورث "index, follow" من الـ layout جنب الـ noindex اللي Next بيحطه لحاله
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <div style={{ padding: "120px 20px" }}>
      <h1 style={{ fontSize: 28, color: "#fff", textShadow: "var(--o3)" }}>Page not found</h1>
      <p style={{ color: "var(--ink)", marginTop: 16 }}>
        <Link href="/">Back home</Link>
      </p>
    </div>
  );
}
```

## الملفات
`src/app/{layout,page,not-found}.tsx` و`src/app/globals.css` و`src/app/sitemap.ts` (تعديل)، `src/styles/pixel/*.css` (16 ملف، 4 منهم معبّايين)، `src/game/{stages,persist,boot}.ts`، `src/components/game/game-root.tsx`، `src/components/layout/skip-link.tsx`، `package.json`

## Definition of Done
- [x] `npm run lint && npm run build` ناجحين، وما في ولا import لـ `@/components/ui` أو `next-themes` أو `radix-ui` أو `sonner` (`git grep` بيرجّع فاضي).
- [x] الخلفية سماوية (`--sky-3`)، العنوان بخط Press Start 2P، والنص بخط Pixelify Sans بالوزنين.
- [x] تاب الـ Network: الخطين من نفس الـ domain (`/_next/static/media/`)، وما في request لـ `fonts.googleapis.com`.
- [x] `<html>` بالـ Elements فيه `data-js` و`data-stage` و`data-time` و`data-gems`.
- [x] على `npm run build && npm run start`: افتح `/#skills` ← `data-stage="skills"`. افتح `/#xyz` ← `home`.
- [x] بالـ console: `localStorage.setItem("ms-time", "night")` وrefresh ← `data-time="night"` من أول paint (بدون ما تمرق عالـ `day`).
- [x] `localStorage.setItem("ms-gems", '["about","nope"]')` وrefresh ← `data-gems="about"`.
- [x] بالـ dev (`npm run dev`): الـ attributes موجودة بعد الـ hydration (يعني `reapplyBoot` شغّال)، وما في hydration warnings بالـ console.
- [x] Tab من أول الصفحة ← بيطلع زر "Skip to content" بالأصفر.

## ملاحظات التنفيذ
- **`npm run format` ما اشتغل متل ما هو.** السكربت `prettier --write .`، وما في شي بيستثني `design/` ولا `docs/`. جرّبناه بـ `--check`: بيعيد تنسيق `design/pixel art.html` (من 2614 لـ 5269 سطر، يعني أرقام الأسطر بهالخطة بتروح)، و`design/reference.html`، وكل ملفات `docs/`، و`CLAUDE.md`، وملفات الـ `.md` بـ `public/projects/`. اشتغل بداله `npx prettier --write src package.json`. الـ `.prettierignore` تبع المرحلة 02 فيه الملف المولّد بس، فالمشكلة بتضل بعدها. **القرار عند صاحب الموقع** (شوف الـ README).
- **ملفات الـ CSS الأربعة** طلعت من المرجع بـ `git show 04412b1:"design/pixel art.html"` (مش نسخ بالإيد)، وبعدها Prettier عاد تنسيقها: declaration بكل سطر، ألوان الـ hex بحروف صغيرة، و`.25` صارت `0.25`. المعنى نفسه. انفحص آلياً: أسطر المرجع + التعديلات المكتوبة فوق، بعد نفس التنسيق، = الملف حرف بحرف.
- **أول سطر بكل ملف من الأربعة تعليق** بيقول من أي أسطر بالمرجع إجا (`/* TOKENS: الأسطر 679–715 من design/pixel art.html */`). مش مكتوب بالخطة.
- **`src/lib/utils.ts`:** Prettier ضاف `;` بآخر السطر. الملف من v1 وما كان مفرمت.
- **الـ build فشل أول مرة** بـ `Can't resolve '@vercel/turbopack-next/internal/font/google/font'` على الخطين، ونجح بالمحاولة التانية بدون أي تعديل. هي رسالة Turbopack لما يفشل تنزيل ملفات الخط من `fonts.gstatic.com`: `next/font/google` بينزّلهم مع كل build. إذا رجعت، عيد الـ build قبل ما تدوّر على غلط بالكود.
- **فحص الـ `git grep`:** على `src/` و`package.json` بيرجّع فاضي. على المشروع كله بيطلّع `docs/` و`CLAUDE.md` (نصوص، مش imports).
- **"من أول paint" انقاس** على `next start`: الـ attributes انحطت عند 15ms، الـ `<body>` بلّش بعدها، وأول paint عند 48ms. وانفحص كمان اللي مش مكتوب فوق: hash بـ encoding خربان ← `home`، `ms-time` بقيمة غلط ← من `prefers-color-scheme`، و`ms-gems` بـ JSON خربان أو مش مصفوفة ← فاضي.
- **المقارنة مع المرجع** (6 عروض × نهار وليل): قيم الـ tokens والـ `body` والـ `html` المحسوبة بالمتصفح مطابقة للمرجع بكل الحالات.
- سيرفر الـ dev كان شغّال على 3000 طول التنفيذ، ففحص الـ production انعمل على `next start -p 3100`.
