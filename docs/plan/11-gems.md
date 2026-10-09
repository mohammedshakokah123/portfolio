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

/**
 * "2/5". السيرفر بيرسم 0/5، وبعد الـ hydration بيصير الرقم المحفوظ.
 * نص واحد (template string): `{a}/{b}` بيطلع 3 قطع نص وبيكسر الـ kerning بخط Pixelify (قائمة الـ pause).
 */
export function GemCounter() {
  const gems = useStore(gemsStore, NONE);

  return <span>{`${gems.length}/${GEM_IDS.length}`}</span>;
}
```

### 5. استعمال العدّاد

**`src/components/layout/hud.tsx`:** بدّل الـ `<span>0/{GEM_IDS.length}</span>` والتعليق اللي فوقه:
```tsx
          <GemCounter />
```
(وشيل import `GEM_IDS` من الملف.)

**`src/components/game/pause-menu.tsx`:** بدّل الـ `` <span>{`0/${GEM_IDS.length}`}</span> `` والتعليق:
```tsx
          <span>
            <GemCounter />
            {` ${labels.pause.gems}`}
          </span>
```
(وشيل `GEM_IDS` من الـ import. النص اللي بعد العدّاد بيضل template string واحد، مع الفراغ جوّاه.)

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
- [x] بكل مرحلة من الخمسة جوهرة teal بتدور وبتطلع وبتنزل، عاليمين جنب العنوان. شاشة البداية ما فيها.
- [x] كبسة: بتطير لفوق وبتختفي، 12 قطعة confetti، toast "Gem 1 of 5 found" لـ 3.6 ثانية، والعدّاد بالـ HUD بيصير `1/5` فوراً.
- [x] الجوهرة الخامسة: toast "All 5 gems found. Thanks for exploring!"، confetti كبير من نص الشاشة، وصوت النجاح.
- [x] عدّاد قائمة الـ pause نفس رقم الـ HUD.

**الحفظ:**
- [x] Refresh بعد جمع جوهرتين: العدّاد `2/5`، والجوهرتين **مش ظاهرين من أول paint** (سجّل الـ Performance أو بطّئ الـ CPU وتأكد إنهم ما بيبينوا لحظة).
- [x] `localStorage.getItem("ms-gems")` ← `["about","skills"]` (نفس صيغة المرجع).
- [x] `localStorage.removeItem("ms-gems")` وrefresh ← الخمسة رجعوا والعدّاد `0/5`.

**الـ focus:**
- [x] Tab للجوهرة وEnter: بتنجمع، والـ focus بيروح لعنوان المرحلة (مش للـ body).
- [x] الجوهرة المجموعة مش بترتيب الـ Tab.

**الأصوات:**
- [x] كل أسطر جدول الأصوات فوق مجرّبة والصوت مفعّل.
- [x] والصوت مطفي: ولا صوت من ولا حدث.

**عام:**
- [x] `prefers-reduced-motion`: الجوهرة ما بتدور، والجمع بدون confetti، والـ toast والعدّاد شغالين.
- [x] `npm run lint && npm run build && npm run sprites:check` ناجحين.

## ملاحظات التنفيذ
- **الكود متل الخطة، إلا العدّاد انكتب كنص واحد.** `GemCounter` بيرسم `` {`${gems.length}/${GEM_IDS.length}`} ``، وبقائمة الـ pause النص اللي بعده ضل `` {` ${labels.pause.gems}`} ``. الصيغة اللي كانت مكتوبة هون (`{gems.length}/{GEM_IDS.length}`، و`<GemCounter /> {labels.pause.gems}`) بتطلّع كذا قطعة نص، والـ kerning بخط Pixelify بيوقف عند كل قطعة (ملاحظة المرحلة 06). كود الخطوتين 4 و5 فوق تعدّل ليطابق اللي انكتب.
- **⏳ فرق عن المرجع جاي من الخطة: العدّاد بيزيد وقت الكبسة.** بالمرجع `renderGems()` بتنادى جوّا الـ `setTimeout` تبع الـ 500ms (السطر 2416)، فالرقم بالـ HUD وبقائمة الـ pause بيتغيّر لما الجوهرة تخلص طيران وتختفي. الخطة بتزيده وقت الكبسة (التعليق بالكود، وسطر الـ DoD "فوراً")، وهيك انعمل. بالقياس: النسخة بعد 2ms من الكبسة، والمرجع بعد ~510ms. كل شي تاني (الـ toast، الـ confetti، الصوت، حركة الجوهرة، الـ focus) بنفس التوقيت بالصفحتين. **مستني قرار صاحب الموقع:** يضل هيك، ولا يصير متل المرجع (4 أسطر بـ `gems.ts`: الـ store بيتحدّث جوّا الـ timeout مع `data-gems`). مكتوب بجدول الفروقات بـ [00-overview.md](00-overview.md).
- **العدّاد بعد الـ refresh (متل ما الخطة كاتبة: السيرفر بيرسم `0/5`).**
  - الجواهر المجموعة ما بتبين ولا لحظة. الفحص أخد عيّنة كل 4ms من أول لحظة بالصفحة (780 عيّنة، و623 مع CPU مبطّأ 6 مرات): ولا وحدة فيها الجوهرة مرسومة. ومع سكربتات التطبيق محجوبة كلها (الـ boot script لحاله) بتضل مخفية.
  - الرقم غير. عالجهاز العادي الـ hydration بتخلص قبل أول paint (`2/5` عند 83ms، وأول paint عند 108ms)، فما بيبين `0/5`. مع CPU مبطّأ 6 مرات بيبين `0/5` من أول paint (288ms) لحد ~1.2 ثانية، وبعدها `2/5`. المرجع ما بيبيّن `0/5` أبداً (السكربت تبعه بيشتغل قبل أول paint).
  - تحت 480px عدّاد الـ HUD مخفي، فهاد بيبين بس على شاشة أعرض مع جهاز بطيء، ولحدا راجع وجامع جواهر. ما انعمل عليه شي (الخطة ما بتطلب).
- **فحص السلوك** (112 فحص على الـ production build، Chrome 154). كل تسلسل انعمل عالمرجع كمان (الملف مباشرة، بخطوطه من Google) والنتيجتين انقارنوا سطر بسطر: 105 مطابقين، والـ 7 الباقيين فرقهم الوحيد توقيت العدّاد اللي فوق.
  - **الجمع بالماوس، الخمسة ورا بعض:** 5 جواهر (وحدة بكل مرحلة، وشاشة البداية بدون)، `button` بـ `aria-label="Collect bonus gem"`، 40×36، طرفها اليمين على طرف الـ `stage-head`، وبتمر على الـ 4 frames وبتطلع وبتنزل. الكبسة: `is-collected` (حركة `gem-get`، و`pointer-events: none`)، 12 قطعة confetti من نص الجوهرة، toast "Gem N of 5 found" (طفى بعد 3620ms)، نغمتين الـ gem، و`ms-gems` بينكتب فوراً. بعد ~510ms الـ class بينشال، الجوهرة بتختفي، و`html[data-gems]` بيتحدّث بترتيب المراحل. الخامسة: بعد 461ms toast "All 5 gems found. Thanks for exploring!" و48 قطعة من (نص العرض، تلت الارتفاع) ونغمات النجاح.
  - **العدّادين:** قائمة الـ pause نفس رقم الـ HUD بعد كل جوهرة، وبالآخر انفتحت القائمة على 1024px و"5/5 bonus gems found" ظاهر.
  - **الحفظ:** `["about","skills"]` بالحرف بعد جوهرتين. بعد refresh العدّاد `2/5`، الجوهرتين مخفيين، والتلاتة الباقيين بمحلهم. `removeItem("ms-gems")` وrefresh ← الخمسة رجعوا و`0/5`. قيم خربانة بالـ storage (`{"a":1}`، نص مش JSON، `"about"`، مصفوفة فيها ids غلط ومكرّرة) ما بتكسر شي: بتنفلتر وبيضل الصح بس.
  - **الكيبورد:** Tab من عنوان المرحلة بيوقف عالجوهرة (حلقة focus وردية 3px). Enter وSpace بيجمعوها، والـ focus بيروح لعنوان المرحلة فوراً وبيضل عليه (ولا مرة عالـ `<body>`). الـ Tab اللي بعدها بيروح لأول رابط بالمحتوى، وبعد refresh الجوهرة المجموعة برّا ترتيب الـ Tab.
  - **reduced motion:** الجوهرة واقفة (frame واحد، بدون `transform`، وولا animation شغّالة)، والجمع بدون ولا قطعة confetti، والـ toast والعدّاد والصوت والـ focus شغّالين. نفس المرجع.
- **جدول الأصوات كله.** النغمات انلقطت من الـ `AudioContext` بالصفحتين (نوع الموجة والتردد لكل نغمة).
  - **33 صف مطابقين للمرجع وللجدول فوق:** زر الصوت (تشغيل، تطفاية، تشغيل)، النهار/الليل من الـ HUD ومن قائمة الـ pause، الكبسة عالشخصية، "Press start" (`start` وبعدها `jump` و`warp`)، روابط المراحل من الـ HUD والـ ground bar وقائمة الـ pause ومن جوّا المحتوى (`select` وبعدها `warp`)، الأسهم وBack وForward (`warp` بس)، فتح قائمة الـ pause ومودال المشروع (`select`)، الـ block وأيقونة الـ inventory (`bump`)، والإرسال الفاضي (`error`). تسكير المودال وزر Resume بدون صوت بالصفحتين.
  - **بالنسخة لحالها** (المرجع ما فيه lightbox، وفورمه `mailto:`): فتح الـ lightbox (`select`)، نجاح الفورم من طريق الـ honeypot (`success`، وما انبعت شي)، وفشل الإرسال (`error`).
  - **زر صورة الـ HD** انفحص ببناء مؤقت فيه صورة (`profileImage` على صورة موجودة بـ `public/`؛ رجع `null` بعدها، و`site.ts` مطابق للـ commit بالحرف): الكشف `gem`، والرجوع `select`.
  - **الصوت مطفي:** 17 حدث ورا بعض، ومنهم الجواهر الخمسة والاحتفال: ولا نغمة، وما بينخلق `AudioContext` أصلاً. نفس المرجع.
  - سيرفر الفحص شغّال بـ `RESEND_API_KEY` غلط: محاولة الإرسال الوحيدة (صف فشل الإرسال) رفضها Resend، وولا إيميل انبعت.
- **المقارنة مع المرجع والجوهرة جزء منها** (المراحل السابقة كانت تخبّيها بالمرجع، لأن النسخة ما كان فيها). 91 حالة، الـ computed styles لكل عنصر وبعدها البكسلات: ولا فرق بالبنية ولا بالـ styles، وولا بكسل مختلف.
  - شاشة البداية والمراحل الخمسة، 78 حالة: العروض الستة نهار وليل، ومعهم حواف الـ breakpoints لـ Projects وContact.
  - جوهرتين محفوظين، 9 حالات: جوهرة Skills مخفية والعدّاد `2/5` (7 عروض)، وجوهرة Experience بمحلها.
  - قائمة الـ pause مفتوحة، 4 حالات: `2/5` و`0/5` و`5/5`.
  - الشي الوحيد اللي طلع بالتقرير هو `margin` تبع `.stage-inner` (Chrome بيرجّعه مرة بالقيمة ومرة `0px`، والمستطيلات متساوية): مكتوب بالـ Gotchas بـ `CLAUDE.md`.
- **سيرفر الـ dev (Strict Mode):** مع جوهرتين محفوظين `data-gems` بيضل عالـ `<html>` بعد الـ hydration (`reapplyBoot`)، العدّاد `2/5`، والجمع والحفظ شغّالين، وبدون ولا رسالة بالـ console.
- **ظاهرة بالفحص، مش بالكود:** بأول تشغيل، جوهرة انجمعت بـ Space ضلّت ظاهرة بعد 750ms (الـ timer تبع الـ 500ms تأخر بمتصفح الفحص). انعادت 6 مرات بعدها، بنفس التسلسل ولحالها، بكبسة عادية وبكبسة مطوّلة: الـ class بينشال بعد 503–512ms بالنسخة وبالمرجع.
- **Safari وFirefox ما انفحصوا.**
