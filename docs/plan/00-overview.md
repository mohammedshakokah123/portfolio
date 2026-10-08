# 00: نظرة عامة

## الهدف
تحويل `design/pixel art.html` (ملف واحد فيه boot script وCSS وHTML ومحرك JS) لنفس تطبيق الـ **Next.js App Router** الموجود، بحيث:

- الشكل والحركة يطلعوا **1:1 مع الملف**.
- المحتوى يضل من `src/content/` (الملف المرجعي فيه محتوى وهمي).
- الـ SEO والـ Accessibility والفورم الحقيقي (Server Action + Resend) يضلوا شغالين.

## القرارات

**من صاحب الموقع (2026-10-08):**

| # | القرار | الأثر |
|---|--------|-------|
| 1 | التصميم الجديد **بيستبدل** الأول، 1:1 مع الملف | قاعدة "هادي وبدون loops" تبع v1 ما عادت سارية. التصميم الأول بيضل على `main` وبالـ git history |
| 2 | الخطة بـ `docs/plan/`، والقديمة بـ `docs/plan-v1/` | - |
| 3 | الـ CSS بينتقل **متل ما هو** وبنفس أسماء الـ classes، وTailwind بيضل للـ utilities | ملفات CSS منظمة بـ `src/styles/pixel/` بدل ترجمة لـ Tailwind |
| 4 | تفاصيل المشروع **بمودال** متل التصميم | صفحات `/projects/[slug]` بتنحذف، والمعرض بيصير جوّا المودال |

**تقنية:**

| القرار | السبب |
|--------|-------|
| الـ sprites بتتولّد **وقت الـ build** لملف CSS ثابت، مش بالمتصفح | المرجع بيولّدهم بسكربت 24KB بالـ `<head>`. كملف CSS: 94KB خام و10KB بعد brotli، بينحفظ بالـ cache، صفر JS، وبيشتغل والـ JS مطفي |
| فحص تطابق آلي مع المرجع (`sprites:check`) | الـ pixel art ما بيتحمّل "تقريباً": حرف واحد غلط = بكسل غلط |
| Boot script صغير inline بالـ `<head>` | الـ hash والـ `localStorage` ما بيوصلوا للسيرفر. بدونه الصفحة بترجف (بتبين home وبعدين المرحلة المطلوبة). الطريقة موثّقة بـ `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md` |
| المحرك modules TS عادية (`src/game/`) منقولة من سكربت المرجع | النقل شبه حرفي، فالمقارنة مع المرجع سهلة. React بس بيرسم الـ markup |
| الحالة بـ stores صغيرة + `useSyncExternalStore` | بدون حزم جديدة. الـ client components بتشترك بس باللي بيلزمها |
| Event delegation عالـ `document` (روابط `#stage`، `[data-dialog]`، `[data-close]`، `[data-pop]`، `.gem`) | محتوى المراحل بيضل **Server Components** بدون JS إضافي |
| صفحة وحدة `/` فيها الـ 6 مراحل وكل مودالات المشاريع | كل المحتوى بالـ HTML من السيرفر (SEO)، و`html[data-stage]` بيبيّن مرحلة وحدة |
| `<dialog>` native للمودالات والـ lightbox | focus trap وEsc و`::backdrop` ببلاش، و`radix-ui` بتنشال |
| نهار/ليل بدل dark/light | `next-themes` بتنشال، والحالة بـ `html[data-time]` |
| 31 أيقونة pixel بدل `lucide-react` | نفس أيقونات التصميم، والمحتوى بيصير serializable (أسماء نصية) |
| الخطوط بـ `next/font/google` | self-hosted، بدون request لـ Google، ومع fallback مقيوس بيقلل الـ layout shift |
| الفورم بيضل Server Action + Resend | المرجع بيفتح `mailto:`، وهاد تراجع عن اللي عنا |

## تحليل التصميم

### المراحل

| # | `id` | الاسم | المحتوى | الـ props بالعالم |
|---|------|-------|---------|-------------------|
| 0 | `home` | Title | logo الاسم (حروف بتنزل)، الدور، نافذة التعريف، القائمة، الـ facts، الـ hint | شجرتين |
| 1 | `about` | About | player card (صورة + stats)، bio، abilities | 3 شجرات |
| 2 | `skills` | Skills | 4 نوافذ inventory | شجرة + صف blocks (من 1600px وطالع) |
| 3 | `experience` | Experience | خريطة المسار + quests | علم، و**skyline بدل الجبال** |
| 4 | `projects` | Projects | كارتريدج لكل مشروع + مودال | شجرة |
| 5 | `contact` | Contact | روابط، فورم، credits | شجرة + صندوق بريد |

### الطبقات

| الطبقة | `z-index` | ملاحظة |
|--------|-----------|--------|
| `.world` | 0 | fixed، `pointer-events: none`، `aria-hidden` |
| `.hero-layer` | 1 (و3 من 1400px) | الشخصية ورا المحتوى، وقدّامه بالشاشات العريضة |
| `main` | 2 | `pointer-events: none`، وبس الـ UI الحقيقي بيرجّعها `auto` |
| `.floor` | 3 | الأرض قدّام المحتوى، فالصفحة بتعمل scroll من وراها |
| `.ground-bar` | 4 | - |
| `.hud` | 30 | - |
| `.pop-text` | 40 | - |
| `.wipe` | 80 | - |
| `.toast` | 90 | - |
| `.confetto` | 95 | - |
| `.skip` | 100 | - |
| `<dialog>` | top layer | فوق كل شي، وحتى فوق الـ toast |

### الوحدات والـ breakpoints

- `--u` = بكسل العالم: 4px (و3px تحت 720px). `--b` = بكسل إطارات الـ UI: 3px.
- `--hud-h`: 64px (58px تحت 720px). `--ground-h`: `24 × --u`. `--hero-h`: `22 × --u`.
- Breakpoints: `≤379` `≤479` `≤719` `≤859` `≤1023` `≤1239` `≥1400` `≤1599`. والـ lightbox (مش من المرجع) إله شرط ارتفاع كمان: `max-height: 519px` مع `min-aspect-ratio: 3 / 2` (موبايل بالعرض).

### الحالة المحفوظة (`localStorage`)

| المفتاح | الصيغة | القيمة الافتراضية |
|---------|--------|-------------------|
| `ms-time` | نص خام: `day` أو `night` | من `prefers-color-scheme` |
| `ms-sound` | JSON: `true` / `false` | `false` |
| `ms-gems` | JSON: مصفوفة ids | `[]` |

نفس مفاتيح المرجع وصيغها بالحرف.

### الحركات

| النوع | الحركات |
|------|---------|
| مستمرة (loop) | `drift` 110s، `drift-far` 190s، `twinkle` 2.6s، `blink` 1s، `hero-idle` 1.1s، `hero-idle-sm` 1.1s، `hero-run` 0.44s، `gem-spin` 0.9s، `gem-bob` 1.8s |
| مرة وحدة | `letter-drop` 0.7s، `hero-jump` 0.56s، `gem-get` 0.5s، `bump` 0.3s، `pop-up` 1s، `pop` 0.24s |
| بالـ JS | الـ wipe (300ms تغطية + 300ms كشف)، حركة الشخصية (`transform` transition)، الـ confetti (Web Animations API) |

كلها بتتوقف مع `prefers-reduced-motion: reduce`، والـ router بيبدّل المرحلة فوراً بدون wipe.

## خريطة التغطية (كل block بالمرجع ← وين بيروح)

أرقام الأسطر من `design/pixel art.html` على الـ commit `04412b1`.

### الـ boot script (26–673)

| الأسطر | المحتوى | بيروح لـ | المرحلة |
|--------|---------|----------|---------|
| 28–44 | الـ stage من الـ hash، النهار/الليل، الـ `intro` | `src/game/boot.ts` | 01 |
| 47–218 | `HERO_PAL`، `HERO` (7 frames)، `HEAD` | `src/pixel/sprites/hero.ts` | 02 |
| 219–427 | `ART_PAL`، `ART` | `src/pixel/sprites/art.ts` | 02 |
| 428–464 | `SCENE_PAL`، `GROUND`، `DIRT` | `src/pixel/sprites/ground.ts` | 02 |
| 465–497 | `ICONS` (31 أيقونة) | `src/pixel/sprites/icons.ts` | 02 |
| 499–611 | الـ scenery المولّد (غيوم، تلال، جبال، skyline، نجوم) | `src/pixel/scene.ts` | 02 |
| 613–631 | `svg()`، `uri()`، `strip()` | `src/pixel/svg.ts` | 02 |
| 633–671 | الـ `add()`، الإطارات، الأيقونات | `src/pixel/sheet.ts` + `src/pixel/sprites/frames.ts` | 02 |

### الـ CSS (675–1389)

| # | الأسطر | القسم | بيروح لـ (`src/styles/pixel/`) | المرحلة |
|---|--------|-------|-------------------------------|---------|
| 1 | 679–715 | TOKENS | `tokens.css` | 01 |
| 2 | 720–748 | BASE (+ `.skip`) | `base.css` | 01 |
| 2 | 750–757 | BASE (`.ico`) | `kit.css` | 03 |
| 3 | 762–810 | PIXEL UI KIT | `kit.css` | 03 |
| 4 | 815–875 | HUD | `hud.css` | 05 |
| 5 | 880–990 | WORLD (+ props، blocks، hero) | `world.css` | 05 |
| 6 | 995–1023 | STAGES (+ stage-head، gem) | `stages.css` | 06 |
| 7 | 1026–1049 | TITLE SCREEN | `home.css` | 07 |
| 8 | 1052–1091 | ABOUT | `about.css` | 07 |
| 9 | 1094–1105 | SKILLS | `skills.css` | 08 |
| 10 | 1108–1145 | EXPERIENCE | `experience.css` | 08 |
| 11 | 1148–1183 | PROJECTS | `projects.css` | 09 |
| 12 | 1186–1226 | CONTACT (+ credits) | `contact.css` | 10 |
| 13 | 1231–1241 | GROUND BAR | `ground-bar.css` | 05 |
| 14 | 1246–1303 | STAGE TRANSITION، TOAST، MODALS، PAUSE | `overlays.css` | 06 |
| 15 | 1308–1343 | RESPONSIVE | `responsive.css` | 01 |
| 16 | 1348–1388 | KEYFRAMES + reduced motion | `keyframes.css` | 01 |

### الـ HTML (1392–2045)

| # | الأسطر | الـ block | بيروح لـ | المرحلة |
|---|--------|----------|----------|---------|
| - | 1393 | skip link | `components/layout/skip-link.tsx` | 01 |
| 1 | 1396–1436 | HUD | `components/layout/hud.tsx` + `components/game/{hud-nav,time-toggle,sound-toggle,gem-counter}.tsx` | 05، 06، 11 |
| 2 | 1439–1463 | WORLD | `components/layout/world.tsx` | 05 |
| 3 | 1468–1495 | TITLE SCREEN | `components/stages/title-screen.tsx` | 07 |
| 4 | 1498–1562 | STAGE 1: ABOUT | `components/stages/about.tsx` + `portrait.tsx` + `portrait-photo.tsx` | 07 |
| 5 | 1565–1619 | STAGE 2: SKILLS | `components/stages/skills.tsx` | 08 |
| 6 | 1622–1692 | STAGE 3: EXPERIENCE | `components/stages/experience.tsx` | 08 |
| 7 | 1695–1770 | STAGE 4: PROJECTS | `components/stages/projects.tsx` + `components/projects/cartridge.tsx` | 09 |
| 8 | 1773–1855 | STAGE 5: CONTACT | `components/stages/contact.tsx` + `components/contact/contact-form.tsx` | 10 |
| 9 | 1861–1868 | HERO + FLOOR | `components/layout/world.tsx` (`HeroLayer`، `Floor`) | 05 |
| 10 | 1871–1876 | ground bar | `components/game/ground-bar.tsx` | 05 |
| 11 | 1879–1889 | STAGE TRANSITION + toast + announcer | `components/layout/overlays.tsx` | 06 |
| 12 | 1892–1913 | PAUSE MENU | `components/game/pause-menu.tsx` | 06 |
| 13 | 1916–2045 | PROJECT DETAILS DIALOG + الـ templates | `components/projects/project-dialog.tsx` (المحتوى من `src/content/projects.ts`) | 09 |

### محرك الـ JS (2047–2612)

| # | الأسطر | الـ block | بيروح لـ (`src/game/`) | المرحلة |
|---|--------|----------|------------------------|---------|
| - | 2052–2068 | helpers، `store`، السنة، `scrollRestoration` | `persist.ts`، `util.ts`، `router.ts` | 01، 06 |
| 1 | 2073–2130 | SOUND | `sound.ts` + `components/game/sound-toggle.tsx` | 06 |
| 2 | 2135–2153 | DAY / NIGHT | `time.ts` + `components/game/time-toggle.tsx` | 05 |
| 3 | 2158–2192 | HERO | `hero.ts` | 06 |
| 4 | 2197–2246 | WIPE + بطاقة المرحلة | `wipe.ts` | 06 |
| 5 | 2251–2361 | ROUTER (+ click، keydown) | `router.ts` | 06 |
| 6 | 2366–2430 | GEMS (+ toast، confetti) | `gems.ts`، `effects.ts` | 08، 11 |
| 7 | 2435–2454 | CODE BLOCKS (الـ pop) | `effects.ts` | 08 |
| 8 | 2459–2486 | PROFILE PHOTO | `components/stages/portrait-photo.tsx` | 07 |
| 9 | 2491–2517 | DIALOGS | `dialogs.ts` | 06 |
| 10 | 2524–2594 | CONTACT FORM | `components/contact/contact-form.tsx` (المنطق من v1، مش من المرجع) | 10 |
| 11 | 2599–2610 | START + resize | `router.ts` (`initRouter`) | 06 |

## الـ Stack

| الحزمة | الحالة | ملاحظة |
|--------|--------|--------|
| `next` 16.3.6، `react` 19.2.8، TypeScript، Tailwind v4 | بتضل | - |
| `react-hook-form`، `@hookform/resolvers`، `zod`، `resend` | بتضل | الفورم والـ Server Action |
| `cn` | بتضل | دمج الـ classes (`@/lib/utils`) |
| `next-themes`، `sonner`، `radix-ui`، `shadcn`، `class-variance-authority`، `tw-animate-css` | **بتنشال بالمرحلة 01** | - |
| `lucide-react` | **بتنشال بالمرحلة 04** | بعد ما المحتوى يتحوّل لأيقونات الـ pixel |
| حزم جديدة | **ولا وحدة** | الخطوط من `next/font/google`، والمولّد بيشتغل بـ Node مباشرة (≥ 22.18) |

## هيكل المجلدات النهائي

```
portfolio/
├── design/
│   ├── pixel art.html              ← المرجع
│   └── reference.html              ← مرجع v1 (أرشيف)
├── docs/plan/                      ← هي الخطة
├── docs/plan-v1/                   ← خطة v1 (أرشيف)
├── scripts/
│   └── build-sprites.mjs           ← بيولّد sprites.generated.css وبيفحص التطابق
└── src/
    ├── app/
    │   ├── layout.tsx              ← الخطوط، الـ boot script، الـ shell (HUD، العالم، الـ overlays)
    │   ├── page.tsx                ← الـ 6 مراحل + مودالات المشاريع + JSON-LD
    │   ├── globals.css             ← tailwind + imports الـ pixel + @theme
    │   ├── not-found.tsx · icon.svg · apple-icon.png · opengraph-image.tsx · sitemap.ts · robots.ts
    │   └── actions/contact.ts      ← بدون تغيير
    ├── pixel/                      ← بيانات ورسم (build-time، بدون React)
    │   ├── sprites/{hero,art,ground,icons,frames}.ts
    │   ├── scene.ts · svg.ts · sheet.ts
    ├── game/                       ← المحرك (client، بدون React إلا store.ts)
    │   ├── stages.ts · persist.ts · boot.ts · util.ts
    │   ├── store.ts · stage-store.ts · time.ts · sound.ts · gems.ts
    │   ├── hero.ts · wipe.ts · router.ts · dialogs.ts · effects.ts · engine.ts
    ├── assets/fonts/               ← PressStart2P-Regular.ttf (لصورة الـ OG بس)
    ├── styles/pixel/
    │   ├── tokens · base · kit · hud · world · stages · home · about · skills · experience
    │   ├── projects · contact · ground-bar · overlays · responsive · keyframes (.css)  ← الـ 16 قسم تبع المرجع
    │   ├── fallbacks.css           ← مش من المرجع: بدون JS والطباعة (المرحلة 12)
    │   └── sprites.generated.css   ← مولّد، ما بينعدّل بالإيد
    ├── components/
    │   ├── pixel/                  ← pixel-icon.tsx · btn.ts · tags.tsx
    │   ├── layout/                 ← hud · world · overlays · skip-link
    │   ├── game/                   ← game-root · hud-nav · ground-bar · gem-counter · sound-toggle · time-toggle · pause-menu
    │   ├── stages/                 ← stage · title-screen · about · portrait · portrait-photo · skills · experience · projects · contact
    │   ├── projects/               ← cartridge · project-dialog · project-gallery
    │   ├── contact/                ← contact-form
    │   └── shared/                 ← json-ld · new-tab-hint
    ├── content/                    ← site.ts · labels.ts · skills.ts · experience.ts · projects.ts
    ├── lib/                        ← utils.ts · dates.ts · validations/contact.ts · seo/*
    └── types/                      ← content.ts
```

## الـ Conventions

**اللي بيضل من v1:**
- Server Components بشكل افتراضي. الملفات kebab-case، المكونات PascalCase، وnamed exports (والـ `default` بس للـ pages والـ layouts).
- المحتوى منفصل عن الـ UI: كل نص بييجي من `src/content/`.
- `cn()` من `@/lib/utils` لدمج الـ classes.

**الجديد:**

1. **الـ CSS بـ `src/styles/pixel/` بنفس أسماء classes المرجع.** أي قاعدة مش موجودة بالمرجع بتنكتب تحت تعليق `/* إضافة عن المرجع: السبب */`.
2. **ترتيب الـ imports بـ `globals.css` = ترتيب الأقسام بالمرجع.** في قواعد بنفس الـ specificity وبيغلب فيها اللي بيجي بالآخر. مثال: `.win { padding: 16px }` بالـ responsive (السطر 1329) بتغلب `.modal-win { padding: 0 }` (السطر 1278) عالموبايل. مشان هيك الـ responsive بملف لحاله بالآخر، وما بيتوزّع عالملفات.
3. **`src/pixel/**` بيتشغّل بـ Node مباشرة** (المولّد)، فإله 3 قواعد: الـ imports النسبية مع الامتداد (`./svg.ts`)، استيراد الأنواع بـ `import type`، وبدون `enum` أو `namespace` (syntax بينمسح بس).
4. **`sprites.generated.css` ما بينعدّل بالإيد.** عدّل الخريطة بـ `src/pixel/sprites/` وشغّل `npm run sprites`.
5. **الـ client components ما بتستورد `@/content/site`.** الملف بيحسب الـ site URL وبيرمي error إذا الـ env ناقص، وبيجيب كل المحتوى للـ bundle. النصوص اللي بيلزموا بتتمرّق كـ props من الـ Server Component. (`@/content/labels` مسموح: ثوابت بس.)
6. **التعديل المباشر عالـ DOM من المحرك** (classes، `textContent`، `style`) مسموح بس على عناصر رسمها Server Component (ما بتنعاد ترسم). أي `aria-*` أو نص بيتغيّر مع الحالة بيكون بـ client component مشترك بـ store.
7. **الروابط بين المراحل `<a href="#about">` عادية**، متل المرجع. المحرك بيلقطها بـ listener واحد عالـ `document`. ما في `next/link` إلا لرابط الرجوع بصفحة الـ 404 (وروابط المراحل هنيك بتروح للرئيسية بـ `router.push`).
8. **الـ lint صارم** (`eslint-plugin-react-hooks` 7): ما في `setState` جوّا effect، وما في قراءة ref وقت الـ render. الـ stores بتحل الحالتين.

## الفروقات المقصودة عن الملف المرجعي

| الفرق | السبب |
|------|-------|
| المحتوى من `src/content/`: 3 مشاريع حقيقية بصورها بدل الـ 4 الوهميين | المرجع فيه placeholders |
| شارة الـ quest (`Current quest` / `Quest complete`) بتطلع من التاريخ | بالمحتوى الحالي Davinda خالصة بـ `2026-09`، فبتطلع "Quest complete" (المرجع كاتب "Current") |
| صورة الكارتريدج بنسبة 5:2 بدل 2:1 | صور `00-cover.webp` الموجودة 1920×768 |
| المودال فيه قسم Screenshots مع lightbox | صفحات المشاريع انحذفت، والمعرض لازم يضل |
| زر الـ X بالمودال ثابت 44×44. عالموبايل وصف المشروع تحت العنوان والزر على العرض كله، وعنوان المودال بيصغر تحت 352px | بالمرجع `.btn-icon` بينضغط جوّا الـ flex لما العنوان يلف: 28px على 375 بمحتواه، و24px بعناويننا الأطول (تصليح بعد المرحلة 09) |
| `h1` واحد بالصفحة (الاسم)، وعناوين المراحل `h2`، واللي جوّاها `h3` / `h4` | المرجع فيه `h1` لكل مرحلة. مع الـ JS مطفي كل المراحل ظاهرة، فبيطلعوا 6 `h1` |
| `.block` ← `.q-block` | `block` اسم utility بـ Tailwind |
| `.js` / `.no-js` / `.intro` ← `html[data-js]` / `html:not([data-js])` / `html[data-intro]` | React بيدير `className` تبع `<html>`، والـ attributes أسلم |
| مودال لكل مشروع بدل مودال واحد و`<template>` | المحتوى بيترسم عالسيرفر (SEO) وبدون JS للنسخ |
| الجواهر المجموعة بتتخبّى بـ CSS (`html[data-gems~="about"]`) | الـ boot script بيحطها قبل أول paint، فما بتبين وبتختفي |
| أيقونة زر النهار/الليل بالـ CSS (`[data-time="night"] .time-ico`) | نفس السبب: بدون flash |
| الـ sprites ملف CSS ثابت | قرار تقني (فوق) |
| الخطوط بـ `next/font` | قرار تقني (فوق) |
| الفورم Server Action بدل `mailto:` | عنا إرسال حقيقي |

**اللي بيروح مع صفحات المشاريع:** رابط مباشر لكل مشروع، صورة OG لكل مشروع، وروابطهم بالـ sitemap. التعويض: كل تفاصيل المشاريع بتضل بـ HTML الرئيسية، ومعها `CreativeWork` لكل مشروع بالـ JSON-LD.

## نقاط الخطر (افحصها بإيدك، ما حدا غيرك رح ينتبه)

| # | الخطر | وين بينفحص |
|---|------|------------|
| 1 | **Tailwind preflight** بيغيّر الـ defaults: الروابط بتفقد الـ underline، والـ `<dialog>` بيفقد الـ `margin: auto` | 01 (القائمة الكاملة) و10 (`.credit-links a`) |
| 2 | **بالـ dev، الـ Strict Mode بيمسح الـ attributes** اللي حطها الـ boot script عن `<html>` | 01: `reapplyBoot()` بـ `useLayoutEffect` |
| 3 | **Back/Forward** مع `history.pushState`: لازم المرحلة تتبدّل بدون reload | 06 |
| 4 | **`pointer-events: none` عالـ `main` بيتورّث للـ `<dialog>`** حتى وهو بالـ top layer، فالضغط عالـ backdrop ما بيسكّر | 09: `dialog.modal { pointer-events: auto }` |
| 5 | **`<dialog>` مفتوح جوّا أب `display: none`** = صفحة inert والمودال مش ظاهر | 09: المودالات برّا الـ `.stage`، والـ router بيسكّرها قبل ما يبدّل |
| 6 | **صور المعرض** (40 صورة تقريباً) لازم ما تتحمّل قبل ما ينفتح المودال | 09: افحص تاب الـ Network |
| 7 | **`Object.entries` بيرتّب المفاتيح الرقمية أول**، وإطار اسمه `1` بيخرّب ترتيب الـ sprites | 02: الإطارات مصفوفة tuples، والفحص الآلي بيلقطها |
| 8 | **`boot.toString()`**: الـ function لازم تكون self-contained بدون أي import | 01 |
| 9 | **الخط 8px** (`.hint`، `.stats dt`، الشارات) وتباين `.credits-mini` فوق التراب | 12: بيتقاس بـ axe وLighthouse وبينكتب صريح |
| 10 | **الـ focus** بعد كل انتقال لازم يروح لعنوان المرحلة، وبعد تسكير المودال يرجع للزر | 06 و09 |
