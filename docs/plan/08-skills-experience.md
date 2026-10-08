# 08: مرحلة Skills ومرحلة Experience

## الهدف
- **Skills:** 4 نوافذ inventory (أيقونة دهبية + slots)، وكبسة عالأيقونة أو على blocks العالم بتطلّع اسم مهارة (`+React.js`) مع قفزة صغيرة وصوت.
- **Experience:** خريطة المسار (4 محطات بالـ sprites، والشخصية واقفة عند "Next stage") وتحتها الـ quests.
- ومعهم `effects.ts`: النص الطاير، الـ confetti، والـ toast (التنين الأخيرين بينستعملوا بالمرحلتين 10 و11).

## الفكرة
- المرحلتين **Server Components** كاملين. الكبس على `[data-pop]` بيلقطه listener واحد عالـ `document` (`initPops`)، فلا النوافذ ولا الـ blocks بيحتاجوا يكونوا client.
- الخريطة والـ quests من البيانات: `careerMap` و`experience`. شارة الـ quest من التاريخ: `end === null` ← "Current quest"، غير هيك "Quest complete". والـ quest الأول (الأحدث) بياخد الإطار الدهبي.

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 1094–1105 CSS الـ SKILLS | `src/styles/pixel/skills.css` |
| 1108–1145 CSS الـ EXPERIENCE | `src/styles/pixel/experience.css` |
| 1565–1619 HTML مرحلة Skills | `src/components/stages/skills.tsx` |
| 1622–1692 HTML مرحلة Experience | `src/components/stages/experience.tsx` |
| 2373–2380 `toast` | `src/game/effects.ts` |
| 2382–2402 `confetti` | `src/game/effects.ts` |
| 2435–2454 CODE BLOCKS (الـ pop) | `src/game/effects.ts` (`initPops`) |

## الخطوات

### 1. الـ CSS

#### `skills.css` ← 1094–1105
متل ما هو، بدون تعديل.

#### `experience.css` ← 1108–1145
متل ما هو، مع تعديل مستوى العنوان:

| السطر | المرجع | بيصير |
|-------|--------|-------|
| 1135 | `.quest h2 { … }` | `.quest h3 { … }` |
| 1136 | `.quest h2 .at { … }` | `.quest h3 .at { … }` |

### 2. `src/game/effects.ts`
```ts
import { play } from "./sound";
import { reducedMotion } from "./util";

/** نص صغير بيطلع فوق العنصر وبيختفي (+React.js). الحركة pop-up بـ keyframes.css */
function popText(anchor: Element, text: string) {
  const rect = anchor.getBoundingClientRect();
  const pop = document.createElement("span");
  pop.className = "pop-text";
  pop.textContent = text;
  pop.style.left = `${rect.left + rect.width / 2}px`;
  pop.style.top = `${rect.top - 18}px`;
  pop.style.translate = "-50% 0";
  document.body.appendChild(pop);
  setTimeout(() => pop.remove(), 1000);
}

const CONFETTI_COLORS = ["#FFC83D", "#3FE0C5", "#FF5AD9", "#5462E8", "#FFFFFF", "#FF6B70"];

/** مربعات ملوّنة بتنفجر من النقطة (x, y) وبتوقع. بدون أي شي مع reduced motion */
export function confetti(x: number, y: number, count = 36) {
  if (reducedMotion()) return;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement("i");
    piece.className = "confetto";
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.left = `${x}px`;
    piece.style.top = `${y}px`;
    document.body.appendChild(piece);

    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 170;
    const dx = Math.cos(angle) * speed;
    const dy = Math.sin(angle) * speed - 110;
    const animation = piece.animate(
      [
        { transform: "translate(0, 0)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 240}px)`, opacity: 0 },
      ],
      { duration: 900 + Math.random() * 500, easing: "cubic-bezier(.2, .6, .4, 1)" },
    );
    animation.onfinish = () => piece.remove();
  }
}

let toastTimer = 0;

/** رسالة فوق الصفحة لـ 3.6 ثانية. العنصر role="status"، فقارئ الشاشة بيقرأها */
export function toast(message: string) {
  const el = document.querySelector<HTMLElement>(".toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("is-on");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove("is-on"), 3600);
}

/**
 * أي عنصر عليه data-pop="React.js|Next.js|…": كل كبسة بتطلّع الكلمة اللي بعدها وبترجع للأولى.
 * العدّاد بـ WeakMap لكل عنصر (المرجع بيعمل closure لكل block).
 */
export function initPops() {
  const controller = new AbortController();
  const counts = new WeakMap<Element, number>();

  document.addEventListener(
    "click",
    (e) => {
      const block = e.target instanceof Element ? e.target.closest<HTMLElement>("[data-pop]") : null;
      if (!block) return;

      const words = (block.dataset.pop ?? "").split("|");
      const n = counts.get(block) ?? 0;
      counts.set(block, n + 1);
      const word = words[n % words.length];

      block.classList.remove("is-bump");
      void block.offsetWidth; // reflow: مشان القفزة تعيد حتى لو الكبسات ورا بعض
      block.classList.add("is-bump");
      play("bump");
      popText(block, word.startsWith("+") ? word : `+${word}`);
    },
    { signal: controller.signal },
  );

  return () => controller.abort();
}
```

### 3. `src/game/engine.ts`
ضيف `initPops`:
```ts
import { initPops } from "./effects";
// ...
  const cleanups = [initHero(), initWipe(), initDialogs(), initPops(), initRouter(options)];
```

### 4. `src/components/stages/skills.tsx`
```tsx
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Stage } from "@/components/stages/stage";
import { skills } from "@/content/skills";

export function SkillsStage() {
  return (
    <Stage id="skills">
      <div className="skills-grid">
        {skills.map(({ title, icon, items, pop }) => (
          <article key={title} className="win">
            <h3 className="inv-title">
              {/* لعبة بالماوس بس (aria-hidden): نفس الكلمات مكتوبة بالـ slots تحت، فما بيخسر حدا معلومة */}
              <span className="inv-ico" data-pop={pop.join("|")} title="Click me" aria-hidden="true">
                <PixelIcon name={icon} />
              </span>
              {title}
            </h3>
            <ul className="slots">
              {items.map((item) => (
                <li key={item} className="slot">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Stage>
  );
}
```

### 5. `src/components/stages/experience.tsx`
```tsx
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { Stage } from "@/components/stages/stage";
import { careerMap, experience } from "@/content/experience";
import { labels } from "@/content/labels";
import { formatYearMonth } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { ExperienceItem } from "@/types/content";

export function ExperienceStage() {
  return (
    <Stage id="experience">
      <div className="win map">
        <h3 className="sr-only">{labels.experience.map}</h3>
        <ol className="map-path">
          {careerMap.map(({ sprite, year, label, next }) => (
            <li key={label} className={cn("map-node", next && "is-next")}>
              {next && <span className="map-hero" aria-hidden="true" />}
              <span className="map-icon" aria-hidden="true">
                {/* --s: الـ CSS بيرسم الـ sprite من هالمتغيّر */}
                <i style={{ "--s": `var(--spr-${sprite})` } as React.CSSProperties} />
              </span>
              <span className="map-year">{year}</span>
              <span className="map-label">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="quests">
        {experience.map((item, i) => (
          <Quest
            key={`${item.org}-${item.period.start}`}
            id={`quest-${i}`}
            item={item}
            // الأحدث (أول واحد) بياخد الإطار الدهبي
            featured={i === 0}
          />
        ))}
      </div>
    </Stage>
  );
}

function Quest({ id, item, featured }: { id: string; item: ExperienceItem; featured: boolean }) {
  const current = item.period.end === null;

  return (
    <article className={cn("win quest", featured && "win-gold")} aria-labelledby={id}>
      <p className={cn("quest-badge", !current && "done")}>
        {current ? labels.experience.current : labels.experience.done}
      </p>
      <h3 id={id}>
        {item.title} <span className="at">at</span> {item.org}
      </h3>
      <p className="quest-meta">
        <span>
          <PixelIcon name={item.meta.icon} />
          <Period period={item.period} />
        </span>
        <span>
          <PixelIcon name="check" />
          {item.meta.text}
        </span>
      </p>
      <ul className="quest-list">
        {item.highlights.map((highlight) => (
          <li key={highlight}>{highlight}</li>
        ))}
      </ul>
      {item.tech && <Tags items={item.tech} label={labels.experience.tech} />}
    </article>
  );
}

/**
 * "Feb 2025 – Sep 2026" بـ <time dateTime>، وإذا ما في end: "Present" بدون <time>.
 * بدون span حواليه: الأب inline-flex مع gap، والمرجع حاطط الـ <time> والشرطة عناصر مباشرة جوّاه.
 * الـ   (non-breaking space) متل الـ &nbsp; بالمرجع.
 */
function Period({ period }: { period: ExperienceItem["period"] }) {
  return (
    <>
      <time dateTime={period.start}>{formatYearMonth(period.start)}</time>
      {" – "}
      {period.end ? (
        <time dateTime={period.end}>{formatYearMonth(period.end)}</time>
      ) : (
        "Present"
      )}
    </>
  );
}
```

**الفرق عن المرجع بسطر الـ meta:** المرجع كاتب لـ Davinda "1.5+ years, current" بإيده. هون السطر الأول دايماً الفترة من البيانات (`Feb 2025 – Sep 2026`)، والتاني نص `meta.text`. والجامعة بيصير إلها سطر تاني (`Faculty of Information Engineering`) ما كان بالمرجع.

### 6. `src/app/page.tsx`
```tsx
      <TitleScreen />
      <AboutStage />
      <SkillsStage />
      <ExperienceStage />

      {/* مؤقت: بيتبدّلوا بالمرحلتين 09 و10 */}
      {(["projects", "contact"] as const).map((id) => (
        <Stage key={id} id={id}>
          <div className="win">
            <p>{STAGE_NAMES[id]} content comes in a later phase.</p>
          </div>
        </Stage>
      ))}
```

## الملفات
`src/styles/pixel/{skills,experience}.css`، `src/game/{effects,engine}.ts`، `src/components/stages/{skills,experience}.tsx`، `src/app/page.tsx`

## Definition of Done
**Skills (قارن مع المرجع):**
- [x] 4 نوافذ بعمودين (وعمود واحد من 859px ونازل)، كل وحدة بأيقونة دهبية وslots بإطار أزرق.
- [x] hover على slot: بيطلع 3px وإطاره بيصير دهبي.
- [x] كبسة على أيقونة "Frontend frameworks": بتقفز، وبيطلع `+React.js` فوقها وبيختفي. الكبسة التانية `+Next.js`، وبعد السادسة بترجع لـ `+React.js`.
- [x] على 1680px: الـ 3 blocks العائمين فوق عاليمين بينكبسوا وبيطلّعوا كلماتهم. الكبس على السما الفاضية حواليهم ما بيعمل شي.
- [x] مع الصوت مفعّل: كل كبسة إلها صوت الـ bump.
- [x] الـ Tab ما بيوقف على الأيقونات ولا على الـ blocks.

**Experience (قارن مع المرجع):**
- [x] `/#experience`: الـ skyline ورا، والعلم عاليمين.
- [x] الخريطة: 4 محطات بخط دهبي منقّط بينهم، بالأيقونات الصح (أكاديمية، مكتب، شهادة، علم)، والسنين: `2020`، `1.5 years`، `2026`، `Next stage`.
- [x] المحطة الأخيرة إطارها دهبي والشخصية الصغيرة واقفة فوقها وبتتحرك (idle).
- [x] من 859px ونازل: الخريطة عمودية والخط نازل عاليسار.
- [x] الـ quest الأول بإطار دهبي. الشارة حسب التاريخ: مع البيانات الحالية التنين "Quest complete" بالأخضر.
- [x] جرّب شارة "Current quest": حط `end: null` **للجامعة** مؤقتاً ← شارتها بتصير "Current quest" بالدهبي، فترتها "2020 – Present"، ومحطة الشهادة بالخريطة "In progress". رجّعها. (لا تجرّب على Davinda: `productionYears` بيحسب من الـ `end` تبعها وبيوقّف الـ build.)
- [x] الـ highlights بمثلث teal قبل كل سطر، والـ tags تحتهم.

**عام:**
- [x] `prefers-reduced-motion`: الكبسة ما بتعمل قفزة ولا نص طاير (متل المرجع: الحركتين بيخلصوا فوراً)، وشخصية الخريطة واقفة.
- [x] `npm run lint && npm run build && npm run sprites:check` ناجحين.

## ملاحظات التنفيذ
- **ما في شي تغيّر عن الخطة.**
- **المقارنة:** 40 حالة (Skills وExperience على 375 و768 و1024 و1280 و1440 و1680 وكل حواف الـ breakpoints، نهار وليل، لقطة للصفحة كاملة): ولا بكسل مختلف. الفروقات المقصودة انحطت بالمرجع قبل القياس: نصوص النسخة، سطر الـ `quest-meta` (مبني من التواريخ)، والـ class `done` على شارة Davinda.
- **فرق واحد بدون أثر:** العنوان المخفي "Career map" حجم خطه 19px بدل 28.5px (الـ preflight بيورّث `font-size` للعناوين، والمرجع `h2` بحجم المتصفح الافتراضي). العنصر `sr-only`، فما بيبين.
- **الكبس على `[data-pop]`** انقارن مع المرجع: نفس تسلسل الكلمات (ومنها الرجوع للأولى بعد السادسة)، نفس مكان النص الطاير (فوق العنصر بـ 18px وبنصه)، نفس حركة الـ bump، ونفس نغمات الصوت. الـ blocks على 1680px انكبسوا بالماوس الحقيقي، والكبس على السما جنبهم ما عمل شي.
- **شارة "Current quest"** انجرّبت على سيرفر الـ dev بـ `end: null` للجامعة: الشارة بدون `done`، الفترة "2020 – Present" بـ `<time>` واحد، ومحطة الخريطة "In progress". ورجعت البيانات متل ما كانت.
- **الـ Tab** ما بيوقف لا على الأيقونات ولا على الـ blocks.
