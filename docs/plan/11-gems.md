# 11: الجواهر وجدول الأصوات

## الهدف
جوهرة بتدور بكل مرحلة (5 بالمجموع). الكبسة عليها بتجمعها: بتطير لفوق، confetti، صوت، toast "Gem 2 of 5 found"، والعدّاد بالـ HUD وبقائمة الـ pause بيزيد. بتنحفظ بالمتصفح، ولما يكتملوا الخمسة بيطلع احتفال. وبآخر المرحلة مراجعة إنو **كل حدث بالموقع إله الصوت الصح**.

## الفكرة
- الزر **Server-rendered** جوّا `Stage`، والكبسة بيلقطها listener واحد عالـ `document` (`initGems`)، متل الـ pop.
- **الإخفاء بالـ CSS مش بـ `hidden`:** الـ boot script (المرحلة 01) حاطط `data-gems="about skills"` عالـ `<html>` قبل أول paint، وقاعدة CSS بتخبّي الجواهر المجموعة. هيك اللي جامع جواهر ما بيشوفها بتبين وبتختفي مع كل تحميل.
- العدّاد **client component** صغير مشترك بـ `gemsStore`، مستعمل بمكانين (الـ HUD والـ pause).

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 1017–1023 CSS `.gem` | منقول بالمرحلة 06 بـ `stages.css` |
| 1504 (والباقي) `<button class="gem" data-gem="about">` | `src/components/stages/stage.tsx` |
| 1416–1420 عدّاد الـ HUD، و1896 عدّاد الـ pause | `src/components/game/gem-counter.tsx` |
| 2366–2371 الحالة و`renderGems` | `src/game/gems.ts` (`gemsStore`) |
| 2404–2430 الكبسة عالجوهرة | `src/game/gems.ts` (`initGems`) |

## الخطوات

### 1. `src/styles/pixel/stages.css`
ضيف بآخر الملف:
```css
/* إضافة عن المرجع: المرجع بيخبّي الجوهرة المجموعة بـ hidden من الـ JS بعد التحميل. هون من data-gems
   اللي الـ boot script بيحطها قبل أول paint، فما بتبين وبتختفي */
html[data-gems~="about"] .gem[data-gem="about"],
html[data-gems~="skills"] .gem[data-gem="skills"],
html[data-gems~="experience"] .gem[data-gem="experience"],
html[data-gems~="projects"] .gem[data-gem="projects"],
html[data-gems~="contact"] .gem[data-gem="contact"] {
  display: none;
}
```

### 2. `src/game/gems.ts`
```ts
import { labels } from "@/content/labels";

import { confetti, toast } from "./effects";
import { KEYS, readJson, writeJson } from "./persist";
import { play } from "./sound";
import { GEM_IDS, type GemId } from "./stages";
import { createStore } from "./store";

const isGemId = (value: unknown): value is GemId =>
  (GEM_IDS as readonly unknown[]).includes(value);

/** نفس فلترة الـ boot script: بس الـ ids المعروفة، وبترتيب المراحل */
function initialGems(): readonly GemId[] {
  if (typeof window === "undefined") return [];
  const saved = readJson<unknown>(KEYS.gems, []);
  return Array.isArray(saved) ? GEM_IDS.filter((id) => saved.includes(id)) : [];
}

/** مصفوفة جديدة مع كل تغيير (مش Set بيتعدّل بمكانه): useSyncExternalStore بيقارن بالـ reference */
export const gemsStore = createStore<readonly GemId[]>(initialGems());

function collect(button: HTMLElement) {
  const id = button.dataset.gem;
  if (!isGemId(id) || gemsStore.get().includes(id)) return;

  const gems = [...gemsStore.get(), id];
  gemsStore.set(gems); // العدّاد بيزيد فوراً
  writeJson(KEYS.gems, gems);
  play("gem");

  const rect = button.getBoundingClientRect();
  confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

  // الزر رح يختفي: الـ focus بيروح لعنوان المرحلة بدل ما يضيع عالـ body
  const heading = document.querySelector<HTMLElement>(`#${id} [data-stage-title]`);
  const hadFocus = document.activeElement === button;
  button.classList.add("is-collected"); // حركة gem-get: بتطير لفوق وبتختفي (0.5s)
  setTimeout(() => {
    button.classList.remove("is-collected");
    document.documentElement.dataset.gems = gems.join(" "); // الـ CSS بيخبّيها من هلق وطالع
    if (document.activeElement === document.body) heading?.focus({ preventScroll: true });
  }, 500);
  if (hadFocus) heading?.focus({ preventScroll: true });

  if (gems.length === GEM_IDS.length) {
    setTimeout(() => {
      toast(labels.gems.all);
      play("success");
      confetti(window.innerWidth / 2, window.innerHeight / 3, 48);
    }, 450);
  } else {
    toast(`Gem ${gems.length} of ${GEM_IDS.length} found`);
  }
}

export function initGems() {
  const controller = new AbortController();

  document.addEventListener(
    "click",
    (e) => {
      const button = e.target instanceof Element ? e.target.closest<HTMLElement>(".gem") : null;
      if (button) collect(button);
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
```
> `@/content/labels` مسموح ينستورد هون (ثوابت بس، بدون imports). `@/content/site` ممنوع (00-overview، القاعدة 5).

### 3. `src/game/engine.ts`
```ts
import { initGems } from "./gems";
// ...
  const cleanups = [initHero(), initWipe(), initDialogs(), initPops(), initGems(), initRouter(options)];
```

### 4. `src/components/game/gem-counter.tsx`
```tsx
"use client";

import { gemsStore } from "@/game/gems";
import { GEM_IDS, type GemId } from "@/game/stages";
import { useStore } from "@/game/store";

/** برّا المكوّن: الـ server snapshot لازم يكون نفس الـ reference كل مرة (store.ts) */
const NONE: readonly GemId[] = [];

/** "2/5". السيرفر بيرسم 0/5، وبعد الـ hydration بيصير الرقم المحفوظ */
export function GemCounter() {
  const gems = useStore(gemsStore, NONE);

  return (
    <span>
      {gems.length}/{GEM_IDS.length}
    </span>
  );
}
```

### 5. استعمال العدّاد

**`src/components/layout/hud.tsx`:** بدّل الـ `<span>0/{GEM_IDS.length}</span>` والتعليق اللي فوقه:
```tsx
          <GemCounter />
```
(وشيل import `GEM_IDS` من الملف.)

**`src/components/game/pause-menu.tsx`:** بدّل الـ `<span>0/{GEM_IDS.length}</span>` والتعليق:
```tsx
          <span>
            <GemCounter /> {labels.pause.gems}
          </span>
```
(وشيل `GEM_IDS` من الـ import.)

### 6. `src/components/stages/stage.tsx`
حط الزر مكان التعليق، آخر عنصر جوّا الـ `<header className="stage-head">`:
```tsx
          <button type="button" className="gem" data-gem={id} aria-label={labels.gems.collect} />
```
مع `import { labels } from "@/content/labels";`.

## جدول الأصوات (راجعه كله بهالمرحلة)

فعّل الصوت وجرّب كل سطر. أي حدث بدون صوته = خطأ بالنقل.

| الحدث | الصوت | وين بالكود | المرجع |
|-------|-------|------------|--------|
| كبسة على رابط مرحلة (HUD، pause، ground bar، روابط جوّا المحتوى) | `select` | `router.ts` | 2348 |
| زر "Press start" | `start` + قفزة الشخصية | `router.ts` | 2348–2349 |
| بداية أي انتقال (بما فيه الأسهم وBack) | `warp` | `router.ts` (`go`) | 2304 |
| كبسة عالشخصية | `jump` | `hero.ts` | 2185 |
| فتح مودال (قائمة الـ pause، تفاصيل مشروع) | `select` | `dialogs.ts` | 2504، 2510 |
| فتح الـ lightbox | `select` | `project-gallery.tsx` | إضافة |
| تبديل نهار/ليل | `toggle` | `time-toggle.tsx` | 2151 |
| تفعيل الصوت | `toggle` | `sound.ts` (`toggleSound`) | 2127 |
| كبسة على block أو أيقونة inventory | `bump` | `effects.ts` (`initPops`) | 2443 |
| كشف الصورة HD / رجوعها pixel | `gem` / `select` | `portrait-photo.tsx` | 2484 |
| جمع جوهرة | `gem` | `gems.ts` | 2409 |
| اكتمال الجواهر الخمسة | `success` | `gems.ts` | 2423 |
| الفورم: حقول غلط، أو فشل الإرسال | `error` | `contact-form.tsx` | 2557، 2590 |
| الفورم: الرسالة انبعتت | `success` | `contact-form.tsx` | 2585 |

## الملفات
`src/styles/pixel/stages.css`، `src/game/{gems,engine}.ts`، `src/components/game/{gem-counter,pause-menu}.tsx`، `src/components/layout/hud.tsx`، `src/components/stages/stage.tsx`

## Definition of Done
**الجمع (قارن مع المرجع):**
- [ ] بكل مرحلة من الخمسة جوهرة teal بتدور وبتطلع وبتنزل، عاليمين جنب العنوان. شاشة البداية ما فيها.
- [ ] كبسة: بتطير لفوق وبتختفي، 12 قطعة confetti، toast "Gem 1 of 5 found" لـ 3.6 ثانية، والعدّاد بالـ HUD بيصير `1/5` فوراً.
- [ ] الجوهرة الخامسة: toast "All 5 gems found. Thanks for exploring!"، confetti كبير من نص الشاشة، وصوت النجاح.
- [ ] عدّاد قائمة الـ pause نفس رقم الـ HUD.

**الحفظ:**
- [ ] Refresh بعد جمع جوهرتين: العدّاد `2/5`، والجوهرتين **مش ظاهرين من أول paint** (سجّل الـ Performance أو بطّئ الـ CPU وتأكد إنهم ما بيبينوا لحظة).
- [ ] `localStorage.getItem("ms-gems")` ← `["about","skills"]` (نفس صيغة المرجع).
- [ ] `localStorage.removeItem("ms-gems")` وrefresh ← الخمسة رجعوا والعدّاد `0/5`.

**الـ focus:**
- [ ] Tab للجوهرة وEnter: بتنجمع، والـ focus بيروح لعنوان المرحلة (مش للـ body).
- [ ] الجوهرة المجموعة مش بترتيب الـ Tab.

**الأصوات:**
- [ ] كل أسطر جدول الأصوات فوق مجرّبة والصوت مفعّل.
- [ ] والصوت مطفي: ولا صوت من ولا حدث.

**عام:**
- [ ] `prefers-reduced-motion`: الجوهرة ما بتدور، والجمع بدون confetti، والـ toast والعدّاد شغالين.
- [ ] `npm run lint && npm run build && npm run sprites:check` ناجحين.
