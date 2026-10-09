# 07: شاشة البداية ومرحلة About

## الهدف
أول مرحلتين بمحتواهم الحقيقي: شاشة البداية (logo الاسم بحروف بتنزل، الدور، نافذة التعريف، القائمة، الـ facts) ومرحلة About (بطاقة اللاعب مع الصورة والـ stats، الـ bio، والـ abilities).

## الفكرة
- المكوّنين **Server Components**: markup المرجع بنصوص `src/content/`.
- الـ JS الوحيد هون للصورة الشخصية (الـ pixelate على canvas وزر الـ HD)، وبينبعت **بس إذا في صورة**. هلق `site.profileImage` هو `null`، فبيطلع راس الشخصية بدون أي JS.
- حركة الحروف (`letter-drop`) CSS كلها، بتشتغل بس لما الـ boot script يحط `data-intro` (فتح الصفحة على home، وبدون reduced motion).

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 1026–1049 CSS الـ TITLE SCREEN | `src/styles/pixel/home.css` |
| 1052–1091 CSS الـ ABOUT | `src/styles/pixel/about.css` |
| 1468–1495 HTML شاشة البداية | `src/components/stages/title-screen.tsx` |
| 1498–1562 HTML مرحلة About | `src/components/stages/about.tsx` |
| 1509–1523 HTML الصورة + 2459–2486 JS الـ pixelate | `src/components/stages/portrait.tsx` و`portrait-photo.tsx` |

## الخطوات

### 1. الـ CSS

#### `home.css` ← 1026–1049
متل ما هو، مع تعديل وإضافة:

| السطر | المرجع | بيصير |
|-------|--------|-------|
| 1034 | `.intro .title-logo .row > span { … }` | `html[data-intro] .title-logo .row > span { … }` |

```css
/* إضافة عن المرجع: الحروف بالـ DOM بحالتها الطبيعية ("Mohammad") والـ CSS بيكبّرها، فالاسم بيضل
   مقروء صح لمحركات البحث وللنسخ. المرجع كاتبها capitals بالـ HTML، والشكل نفسه */
.title-logo {
  text-transform: uppercase;
}
```

#### `about.css` ← 1052–1091
متل ما هو، مع تعديل واحد (مستوى العنوان نزل درجة):

| السطر | المرجع | بيصير |
|-------|--------|-------|
| 1090 | `.abilities h3 { … }` | `.abilities h4 { … }` |

### 2. `src/components/stages/title-screen.tsx`
```tsx
import { Fragment } from "react";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export function TitleScreen() {
  const words = site.name.split(" ");
  // رقم أول حرف بكل كلمة: الحروف بتنزل ورا بعض عبر السطرين (--i من 0 لـ 14، و70ms بين كل حرف)
  const offsets = words.map((_, w) => words.slice(0, w).join("").length);

  return (
    <section id="home" className="stage" aria-labelledby="home-title">
      <div className="stage-inner home-inner">
        {/* الـ h1 الوحيد بالصفحة. aria-label: قارئ الشاشة بيقرأ الاسم مرة وحدة، مش حرف حرف */}
        <h1
          id="home-title"
          className="title-logo"
          tabIndex={-1}
          data-stage-title
          aria-label={site.name}
        >
          {words.map((word, w) => (
            <Fragment key={word}>
              {/* المسافة ضرورية: السطرين block بالـ CSS بس، وبدونها النص الخام بيصير "MohammadShakokah" */}
              {w > 0 && " "}
              <span className={cn("row", w % 2 === 1 && "row-gold")} aria-hidden="true">
                {[...word].map((letter, l) => (
                  <span key={l} style={{ "--i": offsets[w] + l } as React.CSSProperties}>
                    {letter}
                  </span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="title-class">{site.role}</p>

        <div className="win home-win">
          <p className="lead">{site.home.lead}</p>
          <p className="muted">{site.home.sub}</p>
        </div>

        <div className="title-menu">
          {/* btn-start: الـ router بيعرفه من الـ class وبيشغّل صوت البداية وقفزة الشخصية */}
          <a className={btn({ size: "start" })} href="#about">
            <PixelIcon name="play" />
            {labels.title.start}
          </a>
          <a className={btn({ variant: "ghost" })} href={site.cvPath} download>
            <PixelIcon name="download" />
            {labels.title.cv}
          </a>
          <a className={btn({ variant: "ghost" })} href="#contact">
            <PixelIcon name="mail" />
            {labels.title.contact}
          </a>
        </div>

        <ul className="facts" aria-label={labels.title.facts}>
          {site.home.facts.map(({ icon, text, tone }) => (
            <li key={text} className={cn("chip", tone === "green" && "chip-green")}>
              <PixelIcon name={icon} />
              {text}
            </li>
          ))}
        </ul>

        <p className="hint">{labels.title.hint}</p>
      </div>
    </section>
  );
}
```

### 3. `src/components/stages/portrait.tsx`
```tsx
import { PortraitPhoto } from "@/components/stages/portrait-photo";

/**
 * الصورة الشخصية بإطار pixel. بدون صورة (profileImage: null) بيطلع راس الشخصية الـ pixel،
 * وما بينبعت أي JS (PortraitPhoto ما بينرسم).
 */
export function Portrait({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <figure className="portrait no-photo">
        <div className="portrait-frame">
          <span className="portrait-fallback" aria-hidden="true" />
        </div>
      </figure>
    );
  }

  return <PortraitPhoto src={src} alt={alt} />;
}
```

### 4. `src/components/stages/portrait-photo.tsx`
```tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { play } from "@/game/sound";
import { cn } from "@/lib/utils";

/** حجم الـ canvas: 36×36 بكسل، والـ CSS بيكبّره بـ image-rendering: pixelated */
const PIXELS = 36;

/**
 * الصورة بتبين 8-bit (canvas فوقها)، وبتصير HD بالـ hover أو بالزر.
 * الحالات بالـ CSS: has-photo (الـ canvas انرسم)، no-photo (الصورة فشلت ← راس الشخصية)، is-hd (الزر مكبوس).
 */
export function PortraitPhoto({ src, alt }: { src: string; alt: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "photo" | "failed">("loading");
  const [hd, setHd] = useState(false);

  // مربع من نص الصورة (لو الصورة مش مربعة) مرسوم مصغّر على الـ canvas
  const pixelate = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    canvas.width = PIXELS;
    canvas.height = PIXELS;
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    ctx.drawImage(
      img,
      (img.naturalWidth - side) / 2,
      (img.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      PIXELS,
      PIXELS,
    );
    setState("photo");
  };

  return (
    <figure
      className={cn(
        "portrait",
        state === "photo" && "has-photo",
        state === "failed" && "no-photo",
        hd && "is-hd",
      )}
    >
      <div className="portrait-frame">
        <Image
          src={src}
          alt={alt}
          width={480}
          height={480}
          sizes="(max-width: 719px) 260px, (max-width: 1023px) 220px, 340px"
          onLoad={(e) => pixelate(e.currentTarget)}
          onError={() => setState("failed")}
        />
        <canvas ref={canvasRef} aria-hidden="true" />
        <span className="portrait-fallback" aria-hidden="true" />
      </div>
      <figcaption>
        <button
          type="button"
          className={btn({ variant: "ghost", size: "small" }, "portrait-toggle")}
          aria-pressed={hd}
          onClick={() => {
            play(hd ? "select" : "gem"); // "gem" لما تنكشف الصورة
            setHd(!hd);
          }}
        >
          <PixelIcon name="grid" />
          {labels.about.hd}
        </button>
      </figcaption>
    </figure>
  );
}
```
> `next/image` بينادي `onLoad` حتى لو الصورة تحمّلت قبل الـ hydration، فما في داعي لفحص `img.complete` تبع المرجع.

### 5. `src/components/stages/about.tsx`
```tsx
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Portrait } from "@/components/stages/portrait";
import { Stage } from "@/components/stages/stage";
import { labels } from "@/content/labels";
import { site } from "@/content/site";

export function AboutStage() {
  const { stats, paragraphs, abilities } = site.about;

  return (
    <Stage id="about">
      <div className="about-grid">
        <article className="win player-card" aria-labelledby="player-name">
          <Portrait src={site.profileImage} alt={site.name} />
          <h3 id="player-name" className="player-name">
            {site.name}
          </h3>
          <p className="player-class">{site.role}</p>
          <dl className="stats">
            {stats.map(({ label, value }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <div className="about-main">
          <div className="win bio">
            <h3 className="win-title">{labels.about.bio}</h3>
            {paragraphs.map((paragraph, i) => (
              <p key={i}>
                {paragraph.map((part, j) =>
                  typeof part === "string" ? part : <strong key={j}>{part.emphasis}</strong>,
                )}
              </p>
            ))}
          </div>

          <div className="win">
            <h3 className="win-title">{labels.about.abilities}</h3>
            <ul className="abilities">
              {abilities.map(({ icon, title, description }) => (
                <li key={title}>
                  <span className="ability-ico" aria-hidden="true">
                    <PixelIcon name={icon} size="lg" />
                  </span>
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Stage>
  );
}
```

**مستويات العناوين:**

| العنصر | المرجع | هون |
|--------|--------|-----|
| عنوان المرحلة | `h1` | `h2` (جوّا `Stage`) |
| اسم اللاعب، "Bio"، "Abilities" | `h2` | `h3` |
| عنوان كل ability | `h3` | `h4` |

### 6. `src/app/page.tsx`
بدّل المرحلتين المؤقتتين:
```tsx
      <TitleScreen />
      <AboutStage />

      {/* مؤقت: بيتبدّلوا بالمراحل 08 لـ 10 */}
      {(["skills", "experience", "projects", "contact"] as const).map((id) => (
        <Stage key={id} id={id}>
          <div className="win">
            <p>{STAGE_NAMES[id]} content comes in a later phase.</p>
          </div>
        </Stage>
      ))}
```
(وشيل import `GEM_IDS` و`site` إذا ما عاد حدا يستعملهم بالملف غير الـ metadata.)

## كيف تجرّب الصورة الشخصية (هلق `null`)
1. حط أي صورة مربعة بـ `public/profile.jpg`.
2. بـ `src/content/site.ts`: `profileImage: "/profile.jpg"`.
3. جرّب (القائمة بالـ DoD)، وبعدين رجّع `null` واحذف الملف إذا مش الصورة الحقيقية.

## الملفات
`src/styles/pixel/{home,about}.css`، `src/components/stages/{title-screen,about,portrait,portrait-photo}.tsx`، `src/app/page.tsx`

## Definition of Done
**شاشة البداية (قارن مع المرجع):**
- [x] الاسم بسطرين: "MOHAMMAD" أبيض و"SHAKOKAH" دهبي، بظل أزرق وأسود، وما بينكسر السطر حتى على 375px.
- [x] على `npm run build && npm run start`، فتح `/`: الحروف بتنزل وحدة ورا التانية (حوالي ثانيتين)، وبعدها الشخصية بتفوت.
- [x] فتح `/#about` وبعدين الرجوع لـ Title: الحروف **ما** بتنزل مرة تانية (الحركة لأول تحميل بس).
- [x] أيقونة "Press start" بتومض، والزر أكبر من الباقي (54px)، وعلى الموبايل بياخد العرض كله.
- [x] الـ facts: 3 chips، والتالتة أيقونتها خضرا. النص من `site.home.facts`.
- [x] الـ hint بيختفي عالموبايل وعلى شاشات اللمس.
- [x] View Source: الـ `h1` نصه `Mohammad Shakokah` (مع مسافة)، وما في غير `h1` واحد بالصفحة.

**About:**
- [x] على 1280px: بطاقة اللاعب عاليسار (340px)، والـ bio والـ abilities عاليمين.
- [x] على 1023px: البطاقة فوق، والصورة جنب الـ stats. على 719px: كله عمود واحد.
- [x] الـ stats 5 أسطر بخطوط فاصلة، والتسمية بخط الـ pixel الصغير.
- [x] الـ bio: "Mohammad Shakokah" و"Davinda" بالأبيض وأثقل.
- [x] الـ abilities: 3 أعمدة بأيقونات teal جوّا slot، وعلى 859px بيصيروا تحت بعض والأيقونة عاليسار.
- [x] بدون صورة: راس الشخصية بنص الإطار، وما في زر "HD photo".

**الصورة (مع صورة تجريبية):**
- [x] بتبين pixelated (36×36 مكبّرة)، وبالـ hover بتصير HD.
- [x] زر "HD photo" بيثبّتها HD وبيصير دهبي، وكبسة تانية بترجّعها.
- [x] اسم ملف غلط ← بيطلع راس الشخصية بدل صورة مكسورة.

**عام:**
- [x] `prefers-reduced-motion`: الحروف ظاهرة فوراً بدون حركة.
- [x] `npm run lint && npm run build && npm run sprites:check` ناجحين.

## ملاحظات التنفيذ
- **تصليح عن الخطة: `pixelate` بـ `portrait-photo.tsx`.** الخطة ناقلة `drawImage` بمستطيل مصدر محسوب من `naturalWidth`، متل المرجع. مع `next/image` الصورة إلها `srcset` و`sizes`: الـ `naturalWidth` بيطلع 340 (مقاس الـ CSS) والملف الفعلي 384px، والـ canvas بيقرأ مستطيل المصدر ببكسلات الملف. النتيجة كانت صورة مقصوصة من فوق-يسار ومكبّرة 1.13 مرة (384 ÷ 340). صارت تنرسم بمستطيل الوجهة (الصورة كلها، والضلع الأقصر = 36)، وهاد ما إله علاقة بمقاس الملف. القصّ صار مطابق للمرجع.
- **ألوان خلايا الصورة مش مطابقة للمرجع بالضبط:** الـ canvas بياخد من نسخة `next/image` (WebP بعرض 384) مش من الملف الأصلي. نفس الشكل ونفس القصّ، بس بعض الخلايا لونها بيفرق شوي. إذا بدنا تطابق تام: `unoptimized` عالصورة (ملف أكبر).
- **اختبار الصورة** انعمل بصورة تجريبية مؤقتة (`public/profile.jpg` ونسخة للمرجع) وانشالت، و`profileImage` رجع `null`. الحالات (pixelated، hover، زر HD، الوصول من مرحلة تانية، فشل التحميل) طلعت مطابقة للمرجع.
- **طريقة المقارنة:** متل المرحلة 05، مع إضافة: نصوص النسخة بتنحط بنفس العناصر بالمرجع قبل القياس، لأن محتوى المرجع placeholder (الـ bio، الـ stats، الـ facts). 40 حالة: شاشة البداية وAbout على 375 و768 و1024 و1280 و1440 و1680 وكل حواف الـ breakpoints، نهار وليل، بلقطة للصفحة كاملة. ولا فرق بالـ styles، وولا بكسل مختلف.
- **فروقات مقصودة:** حروف الاسم بالـ DOM بحالتها الطبيعية مع `text-transform: uppercase` (مكتوبة فوق)، وبطاقة اللاعب بدون صورة ما فيها `<img>` ولا `<canvas>` ولا زر (المرجع بيخبّيهم بالـ CSS).
- **حركة الحروف:** نفس قيم المرجع: `letter-drop 0.7s steps(7) both`، والتأخير من 0.15s لـ 1.13s. وما بتنعاد بعد الرجوع للـ Title.
- **الـ hint على شاشات اللمس** انفحص بـ browser context فيه `hasTouch` (العرض 900px): مخفي بالمرجع وبالنسخة.
- **الخطوط (تكملة ملاحظة المرحلة 05):** مع ملفات Google الأصلية، الفرق بيطلع بس بنصوص Press Start 2P اللي مقاسها مش من مضاعفات 8px. كل نصوص Pixelify Sans مطابقة، فجدول `prep` ما إله أثر.
