# 05: العالم والـ HUD ونهار/ليل

## الهدف
الـ shell الثابت حوالين كل المراحل: مشهد العالم بالخلفية (سما، نجوم، شمس/قمر، غيوم، جبال أو skyline، تلال، props، أرض)، الـ HUD فوق، الـ ground bar تحت، وتبديل نهار/ليل بينحفظ. بآخر المرحلة الصفحة بتشبه المرجع بدون محتوى المراحل، والتنقل لسا ما بيشتغل (المرحلة 06).

## الفكرة
- العالم والـ HUD بالـ **root layout**: بيضلوا ثابتين وما بينعاد رسمهم.
- العالم **Server Component** كله: divs فاضية، والرسم كله بالـ CSS من الـ sprites. الـ props بتبيّن حسب `html[data-stage]`، والليل حسب `html[data-time]`.
- هون منبني أول **stores**: `stageStore` و`timeStore`. الـ HUD nav والـ ground bar بيشتركوا فيهم ويرسموا الحالة الصح من أول تحميل (المرحلة من الـ hash)، والمرحلة 06 بتضيف الـ router اللي بيغيّرهم.

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 815–875 CSS الـ HUD (مع الـ media queries تبعه) | `src/styles/pixel/hud.css` |
| 880–990 CSS العالم، الـ props، الـ blocks، الشخصية | `src/styles/pixel/world.css` |
| 1231–1241 CSS الـ ground bar | `src/styles/pixel/ground-bar.css` |
| 1396–1436 HTML الـ HUD | `src/components/layout/hud.tsx` + `src/components/game/hud-nav.tsx` |
| 1439–1463 HTML العالم | `src/components/layout/world.tsx` (`World`) |
| 1861–1868 HTML الشخصية والأرض | `src/components/layout/world.tsx` (`HeroLayer`، `Floor`) |
| 1871–1876 HTML الـ ground bar | `src/components/game/ground-bar.tsx` |
| 2135–2153 JS النهار/الليل | `src/game/time.ts` + `src/components/game/time-toggle.tsx` |
| 2264–2283 (جزء من `render`: الـ `aria-current` وأزرار prev/next) | `hud-nav.tsx` و`ground-bar.tsx` (بـ React بدل `querySelectorAll`) |

## الخطوات

### 1. الـ CSS

#### `hud.css` ← 815–875
متل ما هو، وبآخره إضافة وحدة:
```css
/* إضافة عن المرجع: أيقونة زر النهار/الليل من data-time مباشرة. المرجع بيبدّل class بالـ JS بعد التحميل،
   وهون الـ boot script حاطط data-time قبل أول paint، فالأيقونة الصح بتطلع من الأول بدون flash */
.time-ico {
  --i: var(--ico-moon);
}
[data-time="night"] .time-ico {
  --i: var(--ico-sun);
}
```

#### `world.css` ← 880–990
متل ما هو، مع تعديل اسم واحد بمكانين:

| السطر | المرجع | بيصير |
|-------|--------|-------|
| 967 | `.block {` | `.q-block {` |
| 972 | `.block.is-bump, .inv-ico.is-bump` | `.q-block.is-bump, .inv-ico.is-bump` |

(`.blockrow` بيضل متل ما هو.)

#### `ground-bar.css` ← 1231–1241
متل ما هو، مع تعديل واحد:

| السطر | المرجع | بيصير |
|-------|--------|-------|
| 1240 | `.no-js .ground-bar { display: none; }` | `html:not([data-js]) .ground-bar { display: none; }` |

### 2. `src/game/store.ts`
```ts
import { useSyncExternalStore } from "react";

export type Store<T> = {
  get(): T;
  set(next: T): void;
  subscribe(listener: () => void): () => void;
};

/** store صغير: قيمة وحدة ومشتركين. المحرك بيغيّره بـ set()، والمكوّنات بتقرأه بـ useStore() */
export function createStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next) {
      if (Object.is(next, value)) return;
      value = next;
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * serverValue: القيمة بالـ HTML اللي من السيرفر (السيرفر ما بيعرف الـ hash ولا الـ localStorage).
 * React بيستعملها وقت الـ hydration، وبعدها مباشرة بيعيد الرسم بالقيمة الحقيقية. بدون hydration mismatch.
 * ⚠️ إذا القيمة object أو مصفوفة، لازم serverValue يكون ثابت معرّف برّا المكوّن (نفس الـ reference كل مرة).
 */
export function useStore<T>(store: Store<T>, serverValue: T): T {
  return useSyncExternalStore(store.subscribe, store.get, () => serverValue);
}
```

### 3. `src/game/stage-store.ts`
```ts
import { stageFromHash, type StageId } from "./stages";
import { createStore } from "./store";

/** المرحلة الظاهرة. القيمة الأولى من الـ hash (نفس مصدر الـ boot script)، والـ router (المرحلة 06) بيغيّرها */
export const stageStore = createStore<StageId>(
  typeof window === "undefined" ? "home" : stageFromHash(window.location.hash),
);
```

### 4. `src/game/time.ts`
```ts
import { KEYS, readRaw, writeRaw } from "./persist";
import { createStore } from "./store";

export type TimeOfDay = "day" | "night";

/** نفس منطق الـ boot script: المحفوظ، وإلا من إعداد النظام */
function initialTime(): TimeOfDay {
  if (typeof window === "undefined") return "day";
  const saved = readRaw(KEYS.time);
  if (saved === "day" || saved === "night") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

export const timeStore = createStore<TimeOfDay>(initialTime());

/** لون شريط المتصفح عالموبايل (من المرجع، السطر 2146) */
const THEME_COLOR: Record<TimeOfDay, string> = { day: "#14142B", night: "#0E1236" };

export function applyTime(time: TimeOfDay) {
  document.documentElement.dataset.time = time;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[time]);
}

export function toggleTime() {
  const next: TimeOfDay = timeStore.get() === "night" ? "day" : "night";
  timeStore.set(next);
  writeRaw(KEYS.time, next);
  applyTime(next);
}
```

### 5. `src/components/game/time-toggle.tsx`
```tsx
"use client";

import { useStore } from "@/game/store";
import { timeStore, toggleTime } from "@/game/time";

type TimeToggleProps = {
  className: string;
  /** نص الزر (بقائمة الـ pause). بدونه الزر أيقونة بس، وبياخد aria-label */
  children?: React.ReactNode;
};

/** الأيقونة (قمر بالنهار، شمس بالليل) من الـ CSS حسب data-time: .time-ico بـ hud.css */
export function TimeToggle({ className, children }: TimeToggleProps) {
  const night = useStore(timeStore, "day") === "night";

  return (
    <button
      type="button"
      className={className}
      aria-pressed={night}
      aria-label={children ? undefined : "Night mode"}
      onClick={toggleTime}
    >
      <span className="ico time-ico" aria-hidden="true" />
      {children}
    </button>
  );
}
```

### 6. `src/components/game/hud-nav.tsx`
```tsx
"use client";

import { stageStore } from "@/game/stage-store";
import { STAGE_NAMES, STAGES } from "@/game/stages";
import { useStore } from "@/game/store";

/** كل المراحل ما عدا شاشة البداية (رابطها هو الاسم بأول الـ HUD) */
const NAV = STAGES.slice(1);

export function HudNav() {
  const current = useStore(stageStore, "home");

  return (
    <nav className="hud-nav" aria-label="Stages">
      <ol>
        {NAV.map((id, i) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={current === id ? "page" : undefined}>
              <span className="hud-num" aria-hidden="true">
                {i + 1}
              </span>
              {STAGE_NAMES[id]}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
```
> المرجع بيحط `data-stage-link` عالروابط ليلاقيها بالـ JS. هون ما بيلزم: الـ `aria-current` من React، والـ CSS أصلاً بيستهدف `[aria-current="page"]`.

### 7. `src/components/layout/hud.tsx`
```tsx
import { HudNav } from "@/components/game/hud-nav";
import { TimeToggle } from "@/components/game/time-toggle";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { site } from "@/content/site";
import { GEM_IDS } from "@/game/stages";

export function Hud() {
  return (
    <header className="hud">
      <a className="hud-player" href="#home" aria-label={`${site.name}, back to title screen`}>
        <span className="hud-avatar" aria-hidden="true" />
        <span className="hud-name" aria-hidden="true">
          <b>
            <span className="full">{site.name}</span>
            <span className="short">{site.shortName}</span>
          </b>
          <small>{site.role}</small>
        </span>
      </a>

      <HudNav />

      <div className="hud-tools">
        <p className="hud-gems" title={labels.gems.title}>
          <span className="gem-ico" aria-hidden="true" />
          <span className="sr-only">{labels.gems.title}:</span>
          {/* ثابت لهلق. المرحلة 11 بتبدّله بـ <GemCounter /> */}
          <span>0/{GEM_IDS.length}</span>
        </p>
        {/* المرحلة 06 بتضيف <SoundToggle /> هون، قبل زر الليل (متل ترتيب المرجع) */}
        <TimeToggle className={btn({ variant: "ghost", size: "icon" })} />
        <a className={btn({}, "btn-cv")} href={site.cvPath} download>
          <PixelIcon name="download" />
          <span className="cv-full">Download CV</span>
          <span className="cv-short">CV</span>
        </a>
        {/* data-dialog: المحرك (المرحلة 06) بيفتح الـ <dialog> اللي الـ id تبعه هالقيمة */}
        <button
          type="button"
          className={btn({ variant: "ghost" }, "menu-btn")}
          data-dialog="pause-menu"
          aria-haspopup="dialog"
          aria-controls="pause-menu"
        >
          <PixelIcon name="menu" />
          <span className="menu-label">Menu</span>
        </button>
      </div>
    </header>
  );
}
```

### 8. `src/components/layout/world.tsx`
```tsx
import { worldBlocks } from "@/content/skills";

/**
 * المشهد الثابت ورا المحتوى. زينة كله (aria-hidden)، والرسم من الـ sprites بـ world.css.
 * on-<stage>: الـ prop بيبين بس بهالمراحل (حسب html[data-stage]).
 */
export function World() {
  return (
    <div className="world" aria-hidden="true">
      <div className="sky" />
      <div className="sky-night" />
      <div className="stars" />
      <div className="stars s2" />
      <div className="sun" />
      <div className="moon" />
      <div className="clouds far">
        <div className="track" />
      </div>
      <div className="clouds">
        <div className="track" />
      </div>
      <div className="mountains" />
      <div className="skyline" />
      <div className="hills" />
      <div className="props">
        <div className="prop tree t1 on-home on-about on-projects on-contact" />
        <div className="prop tree t2 on-home on-about on-skills" />
        <div className="prop tree t3 on-about" />
        <div className="prop blockrow on-skills">
          {/* tabIndex -1: لعبة بالماوس بس، ومش بترتيب الـ Tab (والأب aria-hidden). الكبس عليهم بالمرحلة 08 */}
          {worldBlocks.map((words) => (
            <button
              key={words[0]}
              type="button"
              className="q-block"
              tabIndex={-1}
              data-pop={words.join("|")}
            />
          ))}
        </div>
        <div className="prop flagpost on-experience" />
        <div className="prop mailbox on-contact" />
      </div>
    </div>
  );
}

/** الشخصية. بتبلّش برّا الشاشة (translateX(-200px) بالـ CSS)، والمحرك (المرحلة 06) بيدخّلها */
export function HeroLayer() {
  return (
    <div className="hero-layer" aria-hidden="true">
      <div className="hero-wrap" title="Click to jump">
        <div className="hero">
          <div className="hero-sprite" data-state="idle" />
        </div>
      </div>
    </div>
  );
}

/** الأرض قدّام المحتوى: الصفحة بتعمل scroll من وراها */
export function Floor() {
  return (
    <div className="floor" aria-hidden="true">
      <div className="ground" />
    </div>
  );
}
```

### 9. `src/components/game/ground-bar.tsx`
```tsx
"use client";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { stageStore } from "@/game/stage-store";
import { STAGE_NAMES, STAGES, type StageId } from "@/game/stages";
import { useStore } from "@/game/store";

const longName = (id: StageId) => (id === "home" ? "Title screen" : STAGE_NAMES[id]);

/** name وyear من الـ layout (Server): الـ client components ما بتستورد @/content/site */
export function GroundBar({ name, year }: { name: string; year: number }) {
  const current = useStore(stageStore, "home");
  const i = STAGES.indexOf(current);
  const prev = i > 0 ? STAGES[i - 1] : null;
  // بعد آخر مرحلة منرجع لشاشة البداية
  const next = STAGES[i + 1] ?? "home";
  const dark = btn({ variant: "dark" });

  return (
    <footer className="ground-bar">
      {prev ? (
        <a className={dark} href={`#${prev}`} aria-label={`Previous stage: ${longName(prev)}`}>
          <PixelIcon name="arrow-left" />
          <span>{STAGE_NAMES[prev]}</span>
        </a>
      ) : (
        // بيحفظ مكان الزر مشان النص يضل بالنص
        <span className="spacer" />
      )}
      <p className="credits-mini">
        &copy; {year} {name}
      </p>
      <a className={dark} href={`#${next}`} aria-label={`Next stage: ${longName(next)}`}>
        <span>{STAGE_NAMES[next]}</span>
        <PixelIcon name="arrow-right" />
      </a>
    </footer>
  );
}
```

### 10. `src/components/game/game-root.tsx`
ضيف مزامنة لون المتصفح مع الليل:
```tsx
"use client";

import { useLayoutEffect } from "react";

import { reapplyBoot } from "@/game/boot";
import { applyTime, timeStore } from "@/game/time";

export function GameRoot() {
  useLayoutEffect(() => {
    reapplyBoot();
    // الـ meta theme-color من السيرفر دايماً لون النهار
    applyTime(timeStore.get());
  }, []);

  return null;
}
```

### 11. `src/app/layout.tsx`
الـ `<body>` بنفس ترتيب المرجع:
```tsx
      <body>
        <SkipLink />
        <Hud />
        <World />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <HeroLayer />
        <Floor />
        <GroundBar name={site.name} year={new Date().getFullYear()} />
        <GameRoot />
      </body>
```
مع الـ imports: `Hud` من `@/components/layout/hud`، و`World` و`HeroLayer` و`Floor` من `@/components/layout/world`، و`GroundBar` من `@/components/game/ground-bar`.

### 12. `src/app/page.tsx`
شيل الـ `div` التجريبي كله (بيضل `<JsonLd />` بس). العالم `fixed` وفوق أي محتوى مش positioned، فالنص التجريبي ما عاد يبين. المرحلة 06 بتحط المراحل وبتعطي الـ `main` الـ `z-index` تبعه.

## كيف تجرّب المراحل قبل ما يجي الـ router
- افتح الرابط مع hash: `/#experience`. الـ boot script بيحط `data-stage`، والـ stores بتقرأ نفس الـ hash.
- أو بدّل `data-stage` عالـ `<html>` من DevTools (بيغيّر العالم بس، مش الـ HUD).

## الملفات
`src/styles/pixel/{hud,world,ground-bar}.css`، `src/game/{store,stage-store,time}.ts`، `src/components/layout/{hud,world}.tsx`، `src/components/game/{hud-nav,time-toggle,ground-bar,game-root}.tsx`، `src/app/{layout,page}.tsx`

## Definition of Done
**العالم (قارن مع المرجع جنب بعض):**
- [x] السما 4 شرائط، الشمس فوق عاليمين، غيمتين قريبين وطبقة غيوم بعيدة أصغر، جبال بثلج، تلال، وأرض عشب فوق تراب.
- [x] الغيوم بتتحرك (القريبة أسرع)، والحواف حادة بكل الـ sprites.
- [x] `/#experience`: skyline بدل الجبال، وعلم. `/#contact`: صندوق بريد. `/#about`: 3 شجرات.
- [x] `/#skills` على 1680px: صف الـ 3 blocks ظاهر. على 1440px: مخفي.
- [x] على 375px: كل شي أصغر (`--u: 3px`) وبنفس النسب.

**نهار/ليل:**
- [x] زر القمر ← السما بتغمق، النجوم بتطلع وبتومض، القمر بيطلع والشمس بتنزل (بخطوات، مش smooth)، والجبال والأرض بتغمق.
- [x] الزر بيصير دهبي (`aria-pressed="true"`) وأيقونته شمس.
- [x] Refresh ← بيضل ليل **من أول paint**: لا السما ولا الأيقونة بيمرقوا عالنهار.
- [x] `<meta name="theme-color">` بيصير `#0E1236` بالليل و`#14142B` بالنهار.

**الـ HUD:**
- [x] 1280px: الأفاتار (راس الشخصية)، الاسم والدور، الـ nav المرقّم، العدّاد `0/5`، زر الليل، "Download CV"، وما في زر Menu.
- [x] 1239px ونازل: الـ nav بيختفي وزر "Menu" بيطلع.
- [x] 719px ونازل: الاسم المختصر، "CV" بدل "Download CV"، زر Menu أيقونة بس.
- [x] 479px: العدّاد بيختفي. 379px: الاسم بيختفي.
- [x] `/#skills` ← "Skills" بالـ nav دهبي ورقمه بمربع دهبي (`aria-current="page"`).
- [x] زر الـ CV بينزّل الملف.

**الـ ground bar:**
- [x] `/`: ما في زر يسار، واليمين "About". `/#skills`: "About" يسار و"Experience" يمين. `/#contact`: "Projects" يسار و"Title" يمين.
- [x] النص بالنص `© 2026 Mohammad Shaquqa`، وبيختفي تحت 720px.

**عام:**
- [x] ما في hydration warnings، و`npm run lint && npm run build && npm run sprites:check` ناجحين.
- [x] الشخصية مش ظاهرة لسا (طبيعي: برّا الشاشة لحد المرحلة 06).

## ملاحظات التنفيذ
- **طريقة المقارنة:** المرجع والنسخة انفتحوا بنفس الحالة (المرحلة من الـ hash، و`ms-time` محفوظ)، وبالمرجع انخفى الـ `main` وزر الصوت (بيجي بالمرحلة 06). لكل عنصر بالـ HUD والعالم والأرض والـ ground bar انقارنت كل الـ computed properties والمقاسات (مع `::before` و`::after`)، وبعدها لقطة للصفحتين وفرق البكسلات. 59 حالة: الـ 6 مراحل، العروض 375 و768 و1024 و1280 و1440 و1680، وحواف الـ breakpoints (379/380، 479/480، 719/720، 859/860، 1023، 1239/1240، 1399/1400، 1599/1600)، نهار وليل. النتيجة: ولا فرق بالـ styles، وولا بكسل مختلف.
- **فرقين معروفين ومقصودين:** `.sr-only` تبع Tailwind بيخبّي بـ `clip-path: inset(50%)` والمرجع بـ `clip: rect(0 0 0 0)` (نفس النتيجة ونفس المقاس)، وسنة الـ credits بدون `<span data-year>` لأن React بيكتبها.
- **⏳ الخط عـ Windows (قرار لصاحب الموقع):** لقطة النسخة بتطابق المرجع بكسل ببكسل **بس** لما المرجع بينرسم بنفس ملفات الخط. بملفاته الأصلية في فرق بالنص:
  - ملف Press Start 2P (latin) من Google لمتصفح عـ Windows: 12,512 byte وفيه جداول الـ hinting (`fpgm` و`prep` و`cvt`). اللي بينزّله `next/font/google`: 4,704 byte وبدونها.
  - الأثر عـ Windows بس (macOS وiOS وAndroid بيتجاهلوا الـ hinting): بمقاسات مش من مضاعفات 8px (10px و12px: الـ nav، الاسم، الأزرار) الحواف الأفقية للحروف بتطلع أنعم شوي من المرجع. بمقاس 8px ما في فرق.
  - Pixelify Sans: الفرق جدول `prep` من 7 bytes، ولسا ما انقاس على نص حقيقي (بينقاس بالمرحلة 07).
  - الحل إذا بدنا تطابق كامل: `next/font/local` مع ملف الخط الأصلي (فيه hinting). بيضل self-hosted وبدون request لـ Google، بس بيغيّر قرار "الخطوط بـ `next/font/google`"، فما انعمل.
- **`game-root.tsx`:** الخطة عارضة الملف بدون تعليق الـ JSDoc تبع المرحلة 01. التعليق بقي، وانعدّل نصه ليذكر مزامنة لون المتصفح.
- **زر Menu:** `aria-controls="pause-menu"` بيأشّر على عنصر لسا مش موجود (بيجي بالمرحلة 06).
- **قياس الـ transitions بالـ headless:** أول قراءة للـ style بعد فترة سكون بترجّع القيمة القديمة. لازم قراءات متتالية (كل 150ms مثلاً). هيك تبديل النهار/الليل طلع بنفس خطوات المرجع: 5 خطوات للسما والنجوم و6 للشمس والقمر خلال 0.6s.
- **لتثبيت اللقطات** انلغت الـ animations (`cancel`) بالصفحتين. توقيفها (`pause`) خلّى الغيوم تنرسم بشكلين مختلفين بين لقطة ولقطة.
