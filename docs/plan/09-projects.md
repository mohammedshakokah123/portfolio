# 09: المشاريع (الكارتريدج، المودال، المعرض)

## الهدف
مرحلة Projects: كارتريدج لكل مشروع بصورته الحقيقية، وزر "View details" بيفتح مودال فيه نفس محتوى صفحة المشروع تبع v1 (النظرة العامة، المعمارية، الميزات، الـ stack، الأزرار) ومعه معرض الصور مع lightbox.

## الفكرة
- **مودال لكل مشروع، مرسوم عالسيرفر.** المرجع فيه مودال واحد و`<template>` لكل مشروع بينسخه الـ JS. هون كل مشروع إله `<dialog id="project-<slug>">` جاهز بالـ HTML: المحتوى بيوصل لمحركات البحث، وما في JS للنسخ. الفتح بنفس آلية قائمة الـ pause (`data-dialog`، المرحلة 06).
- **المودالات برّا الـ `.stage`.** `<dialog>` مفتوح جوّا أب `display: none` بيخلّي الصفحة inert والمودال مش ظاهر. فبينرسموا بآخر الصفحة بعد كل المراحل، والـ router بيسكّرهم قبل أي تبديل (المرحلة 06).
- **الـ lightbox `<dialog>` تاني.** المودال الأول بالـ top layer، فأي عارض عادي (portal للـ body) بيطلع **وراه**. `<dialog>` تاني بـ `showModal()` بيطلع فوقه، وEsc بيسكّر الأعلى بس.
- **الصور lazy.** الـ `<dialog>` المسكّر `display: none`، فالمتصفح ما بيحمّل صوره (40 صورة تقريباً) لحد ما ينفتح.

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 1148–1183 CSS الـ PROJECTS | `src/styles/pixel/projects.css` |
| 1271–1287 CSS المودال | `src/styles/pixel/overlays.css` (منقول بالمرحلة 06، وهون إضافتين) |
| 1695–1770 HTML مرحلة Projects | `src/components/stages/projects.tsx` + `src/components/projects/cartridge.tsx` |
| 1916–1927 HTML المودال | `src/components/projects/project-dialog.tsx` |
| 1930–2045 الـ templates (محتوى وهمي) | المحتوى من `src/content/projects.ts` |
| - | `src/components/projects/project-gallery.tsx` (منطق v1، بـ `<dialog>` بدل Radix) |

## الخطوات

### 1. الـ CSS

#### `projects.css` ← 1148–1183
متل ما هو، مع تعديل واحد:

| السطر | المرجع | بيصير | السبب |
|-------|--------|-------|-------|
| 1165 | `aspect-ratio: 2 / 1;` | `aspect-ratio: 5 / 2;` | صور `00-cover.webp` 1920×768 |

وبآخر الملف:
```css
/* إضافة عن المرجع: صورة حقيقية بالكارتريدج (المرجع فيه placeholder بس) */
.cart-shot img {
  object-fit: cover;
}

/* إضافة عن المرجع: معرض الصور جوّا المودال */
.shots {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.shot {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  padding: 0;
  overflow: hidden;
  cursor: zoom-in;
  background: var(--ink-2) padding-box;
  border: calc(2 * var(--b)) solid var(--ink);
  border-image: var(--frame-slot) 2 / calc(2 * var(--b)) stretch;
}
.shot:hover,
.shot:focus-visible {
  border-image-source: var(--frame-slot-on);
}
.shot img {
  object-fit: cover;
}
.shots figcaption {
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.35;
  color: var(--muted);
}

/* العرض محسوب من الارتفاع المتاح (16:10 + الراس والتذييل) مشان الصورة تضل كلها جوّا الشاشة.
   dialog.modal.lightbox (مش dialog.lightbox): لازم يغلب dialog.modal اللي بييجي بعده بـ overlays.css */
dialog.modal.lightbox {
  width: min(100% - 24px, calc((100svh - 190px) * 1.6));
  max-height: none;
}
.lightbox-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
}
.lightbox-shot {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--ink-2);
  border-block: var(--b) solid var(--panel-3);
}
.lightbox-shot img {
  object-fit: contain;
}
/* .lightbox قدّامهم: الـ lightbox جوّا .modal-body بالـ DOM، و`.modal-body p` بتلوّن كل p رمادي */
.lightbox .lightbox-count {
  font: 10px/1 var(--f-pixel);
  color: var(--gold);
}
.lightbox .lightbox-caption {
  flex: 1;
  text-align: center;
  font-size: 17px;
  line-height: 1.35;
  color: #fff;
}
@media (max-width: 719px) {
  .shots {
    grid-template-columns: 1fr;
  }
}
```

#### `overlays.css` (إضافتين بآخر قسم المودال)
```css
/* إضافة عن المرجع: مودالات المشاريع جوّا <main> (المرجع حاططها برّاه)، و`main { pointer-events: none }`
   بيتورّث للـ <dialog> حتى وهو بالـ top layer، فالضغط عالـ backdrop ما بيوصل وما بيتسكّر */
dialog.modal {
  pointer-events: auto;
}

/* إضافة عن المرجع: النظرة العامة والمعمارية فقرتين أو تلاتة (المرجع فقرة وحدة) */
.modal-body section p + p {
  margin-top: 12px;
}
```

### 2. `src/components/projects/cartridge.tsx`
```tsx
import Image from "next/image";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { projectLabels } from "@/content/projects";
import type { Project } from "@/types/content";

/** ألوان الـ placeholder لما ما في cover (من أول كارتريدج بالمرجع) */
const PLACEHOLDER = { "--c1": "#3A45B5", "--c2": "#1E2150" } as React.CSSProperties;

export function Cartridge({ project }: { project: Project }) {
  const titleId = `p-${project.slug}`;
  const lock = project.nda && (
    <span className="lock-badge" aria-hidden="true">
      <PixelIcon name="lock" />
      NDA
    </span>
  );

  return (
    <article className="cart" aria-labelledby={titleId}>
      <div className="cart-ridges" aria-hidden="true" />
      <div className="cart-label">
        {project.cover ? (
          <div className="cart-shot">
            {/* lazy (الافتراضي): المرحلة مخفية لحد ما توصلها، فالصور ما بتتحمّل مع شاشة البداية */}
            <Image
              src={project.cover.src}
              alt={project.cover.alt}
              fill
              sizes="(max-width: 859px) calc(100vw - 80px), 480px"
            />
            {lock}
          </div>
        ) : (
          <div
            className="cart-shot"
            style={PLACEHOLDER}
            role="img"
            aria-label={project.placeholderLabel}
          >
            <div className="shot-art" aria-hidden="true">
              <PixelIcon name={project.icon} size="xl" />
              <span className="shot-note">{projectLabels.placeholder}</span>
            </div>
            {lock}
          </div>
        )}
        <h3 id={titleId} className="cart-title">
          {project.title}
        </h3>
        <p className="cart-sum">{project.summary}</p>
      </div>
      <div className="cart-foot">
        <Tags items={project.tech} label="Technologies" />
        {/* data-dialog: المحرك بيفتح <dialog id="project-<slug>"> (dialogs.ts) */}
        <button
          type="button"
          className={btn({ size: "small" })}
          data-dialog={`project-${project.slug}`}
          aria-haspopup="dialog"
        >
          {projectLabels.viewDetails}
          <span className="sr-only"> for {project.title}</span>
        </button>
      </div>
    </article>
  );
}
```

### 3. `src/components/projects/project-gallery.tsx`
```tsx
"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { play } from "@/game/sound";
import type { Shot } from "@/types/content";

/**
 * شبكة الصور + عارض (lightbox) فوقها. العارض <dialog> تاني: بيطلع فوق مودال المشروع (top layer)،
 * والمتصفح بيتكفّل بالـ focus trap والـ Esc ورجوع الـ focus للصورة المصغّرة.
 * التسكير (زر X والضغط عالـ backdrop) بيلقطه dialogs.ts متل أي مودال. التنقل بالأسهم وبيلف من الآخر للأول.
 */
export function ProjectGallery({ shots }: { shots: readonly Shot[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(0);
  // الصورة الكبيرة ما بتنرسم قبل أول فتح: ما منحمّل صورة بالحجم الكامل لحدا ما كبس عليها
  const [opened, setOpened] = useState(false);
  const shot = shots[active];
  const iconBtn = btn({ variant: "ghost", size: "icon" });

  const show = (index: number) => {
    setActive(index);
    setOpened(true);
    play("select");
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setActive((i) => (i + delta + shots.length) % shots.length);

  return (
    <>
      <ul className="shots">
        {shots.map((s, i) => (
          <li key={s.src}>
            <figure>
              <button type="button" className="shot" aria-haspopup="dialog" onClick={() => show(i)}>
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(max-width: 719px) calc(100vw - 80px), 351px"
                />
              </button>
              <figcaption>{s.caption}</figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="modal lightbox"
        aria-label="Screenshot viewer"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        <div className="win modal-win">
          <div className="lightbox-bar">
            <p className="lightbox-count" aria-live="polite">
              {active + 1} / {shots.length}
            </p>
            <button type="button" className={iconBtn} data-close aria-label="Close screenshot viewer">
              <PixelIcon name="close" />
            </button>
          </div>

          <div className="lightbox-shot">
            {opened && shot && (
              <Image
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 1280px) 80rem, 100vw"
              />
            )}
          </div>

          <div className="lightbox-bar">
            <button type="button" className={iconBtn} onClick={() => step(-1)} aria-label="Previous screenshot">
              <PixelIcon name="arrow-left" />
            </button>
            <p className="lightbox-caption">{shot?.caption}</p>
            <button type="button" className={iconBtn} onClick={() => step(1)} aria-label="Next screenshot">
              <PixelIcon name="arrow-right" />
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
```

### 4. `src/components/projects/project-dialog.tsx`
```tsx
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { NewTabHint } from "@/components/shared/new-tab-hint";
import { getAllProjects, projectLabels } from "@/content/projects";
import type { Project, Shot } from "@/types/content";

/** مودال لكل مشروع، برّا الـ .stage (بآخر الصفحة). السبب بأول ملف المرحلة 09 */
export function ProjectDialogs() {
  return (
    <>
      {getAllProjects().map((project) => (
        <ProjectDialog key={project.slug} project={project} />
      ))}
    </>
  );
}

function ProjectDialog({ project }: { project: Project }) {
  const id = `project-${project.slug}`;
  const { links, nda } = project;
  const hasLinks = Boolean(links.demo || links.source);
  // الصورة الرئيسية أول المعرض، وبعدها باقي الصور
  const shots: Shot[] = [
    ...(project.image ? [{ ...project.image, caption: projectLabels.overviewShot }] : []),
    ...(project.gallery ?? []),
  ];
  const small = btn({ size: "small" });
  const smallGhost = btn({ variant: "ghost", size: "small" });

  return (
    <dialog id={id} className="modal" aria-labelledby={`${id}-title`}>
      <div className="win modal-win">
        <div className="modal-head">
          <div>
            <h2 id={`${id}-title`}>{project.title}</h2>
            <p>{project.subtitle}</p>
          </div>
          <button
            type="button"
            className={btn({ variant: "ghost", size: "icon" })}
            data-close
            aria-label="Close dialog"
          >
            <PixelIcon name="close" />
          </button>
        </div>

        <div className="modal-body">
          <section>
            <h3>{projectLabels.overview}</h3>
            <Paragraphs text={project.overview} />
          </section>
          <section>
            <h3>{projectLabels.architecture}</h3>
            <Paragraphs text={project.architecture} />
          </section>
          <section>
            <h3>{projectLabels.features}</h3>
            <ul className="quest-list">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
          <section>
            <h3>{projectLabels.stack}</h3>
            <Tags items={project.stack} />
          </section>
          {shots.length > 0 && (
            <section>
              <h3>{projectLabels.gallery}</h3>
              <ProjectGallery shots={shots} />
            </section>
          )}

          {/* 3 حالات: NDA ← شارة NDA + walkthrough. في روابط ← الأزرار.
              ما في روابط (لا رابط عام ولا داشبورد خاص) ← شارة accessNote + walkthrough */}
          <div className="modal-actions">
            {nda || !hasLinks ? (
              <>
                <span className="locked">
                  <PixelIcon name="lock" />
                  {nda ? projectLabels.nda : (project.accessNote ?? projectLabels.noPublicDemo)}
                </span>
                {/* رابط مرحلة: الـ router بيسكّر المودال وبيروح على Contact */}
                <a className={smallGhost} href="#contact">
                  {projectLabels.requestWalkthrough}
                </a>
              </>
            ) : (
              <>
                {links.demo && (
                  <a className={small} href={links.demo} target="_blank" rel="noopener noreferrer">
                    <PixelIcon name="external" />
                    {projectLabels.liveDemo}
                    <NewTabHint />
                  </a>
                )}
                {links.source && (
                  <a className={smallGhost} href={links.source} target="_blank" rel="noopener noreferrer">
                    <PixelIcon name="code" />
                    {projectLabels.sourceCode}
                    <NewTabHint />
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

/** السطر الفاضي (\n\n) بالمحتوى = فقرة جديدة */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </>
  );
}
```
> `h2` و`h3` جوّا المودال متل المرجع: المودال سياق لحاله (باقي الصفحة inert وهو مفتوح).

### 5. `src/components/stages/projects.tsx`
```tsx
import { Cartridge } from "@/components/projects/cartridge";
import { Stage } from "@/components/stages/stage";
import { getAllProjects } from "@/content/projects";

export function ProjectsStage() {
  return (
    <Stage id="projects">
      <div className="carts">
        {getAllProjects().map((project) => (
          <Cartridge key={project.slug} project={project} />
        ))}
      </div>
    </Stage>
  );
}
```

### 6. `src/app/page.tsx`
```tsx
      <TitleScreen />
      <AboutStage />
      <SkillsStage />
      <ExperienceStage />
      <ProjectsStage />

      {/* مؤقت: بيتبدّل بالمرحلة 10 */}
      <Stage id="contact">
        <div className="win">
          <p>Contact content comes in the next phase.</p>
        </div>
      </Stage>

      <ProjectDialogs />
```

### 7. `src/lib/seo/json-ld.ts`: المشاريع بالـ JSON-LD تبع الرئيسية
صفحات المشاريع راحت، فكل مشروع بيصير `CreativeWork` بالـ `@graph` تبع الرئيسية. ضيف الـ import، وضيف العناصر بآخر الـ `@graph` جوّا `homeJsonLd()`:
```ts
import { getAllProjects } from "@/content/projects";
```
```ts
      // بعد عنصر الـ WebSite
      ...getAllProjects().map((project) => ({
        "@type": "CreativeWork",
        "@id": `${site.url}/#project-${project.slug}`,
        name: project.title,
        description: project.summary,
        image: project.image ? absoluteUrl(project.image.src) : undefined,
        creator: { "@id": personId },
        keywords: project.stack.join(", "),
      })),
```

## الملفات
`src/styles/pixel/{projects,overlays}.css`، `src/components/projects/{cartridge,project-dialog,project-gallery}.tsx`، `src/components/stages/projects.tsx`، `src/lib/seo/json-ld.ts`، `src/app/page.tsx`

## Definition of Done
**الكارتريدج (قارن مع المرجع):**
- [x] 3 كارتريدج بعمودين (والتالت لحاله بالصف التاني)، وعمود واحد من 859px ونازل.
- [x] الهيكل الرمادي مع الخطوط فوق، والملصق الورقي جوّاه: الصورة (5:2 بدون قص)، العنوان، الوصف.
- [x] hover: الكارتريدج بيطلع 4px وبياخد ظل (بخطوات).
- [x] الـ tags غامقة (`--ink`)، والزر دهبي صغير.
- [x] جرّب مؤقتاً `nda: true` لمشروع ← شارة "NDA" الدهبية فوق الصورة، وبالمودال "Internal system, under NDA". رجّعها.
- [x] جرّب مؤقتاً `cover: null` ← الـ placeholder بالتدرّج والأيقونة ونص "Screenshot". رجّعها.

**المودال:**
- [x] "View details" بيفتحه بحركة pop، الخلفية بتغمق، والصفحة ما بتعمل scroll من وراه.
- [x] العنوان والعنوان الفرعي فوق، وزر X. المحتوى بيعمل scroll جوّا المودال.
- [x] الأقسام بالترتيب: Overview، Architecture، Key technical features، Stack، Screenshots، وبعدها الأزرار.
- [x] Klardent: زر "Live demo" بيفتح بتاب جديد. SooqSuria وChloéllia: شارة الـ `accessNote` + "Request a walkthrough".
- [x] "Request a walkthrough": المودال بيتسكّر وبيصير الانتقال لـ Contact.
- [x] Esc، زر X، والضغط برّا المودال: التلاتة بيسكّروه، والـ focus بيرجع لزر "View details" تبعه.
- [x] فتحه، نزول لآخره، تسكيره، وفتحه مرة تانية: بيفتح من أوله.
- [x] Back بالمتصفح والمودال مفتوح: بيتسكّر والمرحلة بتتبدّل.

**المعرض:**
- [x] الصور المصغّرة بعمودين (وعمود عالموبايل) مع caption، وأول صورة "Overview".
- [x] كبسة على صورة: الـ lightbox بيفتح **فوق** المودال، والصورة كاملة جوّا الشاشة.
- [x] الأسهم (كيبورد وأزرار) بتبدّل الصورة وبتلف من الآخر للأول، والعدّاد "3 / 15" بيتحدّث. والمرحلة **ما** بتتبدّل بالأسهم.
- [x] Esc بيسكّر الـ lightbox **بس**، والمودال بيضل مفتوح، والـ focus بيرجع للصورة المصغّرة.

**الأداء والـ SEO:**
- [x] تاب الـ Network (فلتر Img)، فتح `/`: ولا صورة من `/projects/`. بعد الانتقال لـ Projects: الـ 3 covers بس. بعد فتح مودال: صوره المصغّرة الظاهرة بس.
- [x] View Source للرئيسية: نصوص الـ Overview والـ Architecture تبع الـ 3 مشاريع موجودة بالـ HTML.
- [x] الـ JSON-LD فيه 3 عناصر `CreativeWork` (افحصه بـ [validator.schema.org](https://validator.schema.org) بلصق الكود).

**عام:**
- [x] كل شي فوق بالكيبورد لحاله، بدون ماوس.
- [x] `npm run lint && npm run build && npm run sprites:check` ناجحين.

## ملاحظات التنفيذ
- **الخطوات السبعة انكتبت متل ما هي** (الـ format بس عاد لف كم سطر). بعدها انضاف تصليحين بالـ CSS بطلب صاحب الموقع، وهنن آخر بند بهالملاحظات.
- **بندين من الـ Definition of Done انعلّموا مع توضيح:**
  - "الصورة 5:2 بدون قص": الـ `5 / 2` محسوبة مع الإطار (3px من كل جهة)، فمساحة الصورة جوّاه 467×183 على 1280px. الصورة بتنرسم 467×186.8، يعني بينقص منها 1.9px من فوق و1.9px من تحت (2% من ارتفاعها) وولا شي من العرض.
  - "بعد فتح مودال: صوره المصغّرة الظاهرة بس": المتصفح بيحمّل الصور الـ lazy القريبة من المساحة الظاهرة كمان، مش بس الظاهرة. التفاصيل ببند "تحميل الصور" تحت.
- **المقارنة مع المرجع:** المرجع فيه 4 مشاريع وهمية ومودال واحد فاضي، فالـ markup تبع النسخة (الكارتريدجات والمودال المفتوح) انحط جوّا المرجع ومعه إضافات الخطة عالـ CSS (`5 / 2` وكل القواعد اللي تحت "إضافة عن المرجع")، وبعدها نفس طريقة المرحلة 05. 61 حالة:
  - مرحلة Projects (27): 375 و768 و1024 و1280 و1440 و1680 نهار وليل، وكل حواف الـ breakpoints، بلقطة للصفحة كاملة.
  - المودال المفتوح (25): المشروع الأول على العروض الستة نهار وليل و719/720، والمشروعين التانيين، ومودالات مفتوحة من نصها ومن آخرها (قسم الصور والأزرار).
  - التجربتين المؤقتتين (9): شارة NDA فوق الصورة، الـ placeholder، الـ placeholder مع الشارة، والمودال بنص "Internal system, under NDA".
  - **النتيجة:** ولا فرق بالـ styles ولا بالبنية بولا حالة، إلا قراءة `margin-left` بحالتين (مش فرق حقيقي، ومشروحة ببند "قراءة `margin` الـ `auto` بتخدع" تحت). بالبكسلات: 58 حالة بدون ولا بكسل مختلف، و3 حالات فيهم فرق خفيف جوّا صورة وحدة بس (غلاف ورا الـ backdrop أو صورة مصغّرة) وولا بكسل فرقه فوق 32 من 255.
  - هالـ 3 انعادوا 10 مرات: 9 بدون ولا بكسل، وبوحدة رجع نفس النوع بصورة تانية (أقصى فرق 25). بهالإعادة لقطة المرجع طلعت مطابقة للقطات المرجع بباقي الإعادات، ولقطة النسخة هي اللي اختلفت عن لقطات النسخة التانية. يعني Chrome بيرسم نفس الصورة بفرق بسيط بين تشغيلة وتشغيلة، وهاد مش فرق بالـ CSS. من وين بتيجي انعرف بعدين، ومشروح بآخر بند ("ظاهرة الصور").
- **الـ markup مقابل markup المرجع نفسه** (بدون نقل): الـ placeholder مع شارة NDA مطابق لأول كارتريدج بالمرجع، وأزرار المودال بحالة الـ NDA مطابقة لـ `tpl-pos`. الفروقات كلها مقصودة: `h3` بدل `h2`، `data-dialog` و`aria-haspopup` بدل `data-project`، `aria-hidden` على الأيقونة (من `PixelIcon`)، وألوان الـ placeholder ثابتة (ألوان أول كارتريدج) بدل لون لكل مشروع.
- **قراءة `margin` الـ `auto` بتخدع:** بحالتين من حالات التجربة طلع `margin-left` تبع `.stage-inner` مختلف (المرجع 60px والنسخة 0px) مع إنو مكان العنصر ومقاسه والبكسلات نفسهم. السبب إنو `getComputedStyle` بـ Chrome بيرجّع للـ margin الـ `auto` مرات القيمة المحسوبة ومرات `0px` حسب آخر layout: بالمرجع نفسه القيمة بتصير `0px` بعد `cancel()` للـ animations وبترجع 60px بعد أي layout كامل. فرق `margin` مع نفس الـ `rect` = هالشي، مش فرق بالـ CSS.
- **أغلفة ما كانت تتحمّل وقت الفحص، والسبب مش بالكود.** غلاف SooqSuria وغلاف Chloéllia ضلوا فاضيين عالشاشات العريضة (مقاس 640) وغلاف Klardent طبيعي:
  - طلبين من التلاتة كانوا يوصلوا للسيرفر وما يرجع إلهم جواب أبداً. نفس الرابط من `curl` بيعلّق كمان، وبدون header الـ `Accept` (يعني JPEG بدل WebP) بيرجع فوراً. على سيرفر جديد من نفس الـ build كلهم بيرجعوا.
  - السبب بالـ image optimizer تبع `next start` (Next 16.3.6): أول طلب لمقاس لسا ما انحفظ بالـ cache، إذا انقطع بأول كم millisecond، بيضل هالمقاس معلّق جوّا السيرفر، وكل طلب بعده لنفس الرابط بيستنى بدون نهاية لحد ما ينعاد تشغيل السيرفر. `fetchInternalImage` (بـ `node_modules/next/dist/server/image-optimizer.js`) بيمرّق الـ socket تبع الزبون للطلب الداخلي وبيستنى `hasStreamed`، وهي ما بتخلص إذا الـ socket تسكّر.
  - انعاد إنتاجها على سيرفر جديد: قطع الطلب بعد 0 لـ 3ms علّق مقاسين من 4، وبعد 10ms وطالع ولا واحد من 6.
  - سكربت المقارنة بيعمل reload فوراً بعد الـ load، فكان يقطع طلبات الصور بهاللحظة. الحل وقت الفحص: سيرفر جديد، وطلب كل المقاسات مرة وحدة بدون قطع قبل ما يبلّش السكربت (258 طلب). بعدها ولا صورة علّقت.
  - على Vercel طلبات `/_next/image` بتخدمها خدمة الصور تبع Vercel مش هالكود، فالمشكلة بتهم الفحص المحلي وأي استضافة بـ `next start`. `next dev` ما انفحص.
- **تحميل الصور** (على 1280×800 و375×667):
  - فتح `/` والمرور على About وSkills وExperience: ولا طلب صورة.
  - الوصول لـ Projects: الأغلفة التلاتة بس (مقاس 640 عالديسكتوب و384 عالموبايل).
  - فتح مودال: صوره هو بس، ومش كلها. Chrome بيحمّل الـ lazy ضمن مسافة من المساحة الظاهرة جوّا الـ scroll تبع المودال، فعلى 1280 بيتحمّلوا أول 6 صور مصغّرة من 11 مع إنهم لسا تحت (أبعدهم 1064px) وعلى 375 صورة وحدة. الباقي بيتحمّل مع الـ scroll، وصور المودالين التانيين ما بيتحمّل منها شي.
  - الصورة الكبيرة ما بتنطلب قبل أول كبسة على صورة مصغّرة (مقاس 1920 على 1280، و640 على 375).
- **المودال والمعرض** (31 فحص على الـ production build): الفتح بحركة `pop 0.24s steps(4)`، الـ backdrop، قفل الـ scroll ورا المودال، الـ scroll الداخلي، ترتيب الأقسام بالمودالات التلاتة، الأزرار لكل مشروع ("Live demo" فتح تاب جديد بـ `opener` فاضي)، "Request a walkthrough"، التسكير بالطرق التلاتة مع رجوع الـ focus، الفتح من أوله بعد التسكير، وBack والمودال مفتوح (ومع الـ lightbox فوقه كمان). والمعرض: الشبكة، الـ lightbox فوق المودال (ولا نقطة من الشاشة بتوصل للمودال أو للصفحة وهو مفتوح)، الأسهم واللف من الآخر للأول، وEsc بيسكّر الأعلى بس.
- **الكيبورد لحاله** (13 فحص، بدون ماوس): الأسهم لحد Projects، Tab على الأزرار التلاتة، Enter، Tab جوّا المودال (الـ 15 صورة وبعدها الرابط، وكل عنصر إله focus ring)، وما بيطلع الـ focus عالصفحة اللي ورا. Enter على صورة بيفتح الـ lightbox عليها، والأسهم وEsc متل ما لازم.
- **`prefers-reduced-motion`:** المودال والـ lightbox بيفتحوا فوراً بدون `pop`، والكارتريدج بدون transition.
- **hover الكارتريدج** مطابق للمرجع: `translateY` على 3 خطوات (`-1.33px` وبعدها `-2.67px` وبعدها `-4px`) مع الـ `drop-shadow`.
- **الصوت:** فتح المودال بيطلّع نغمتين الـ select (880Hz و1320Hz) متل المرجع، ونفسهم على كبسة الصورة المصغّرة. والصوت مطفي: ولا نغمة.
- **التجربتين المؤقتتين** (`nda: true` و`cover: null`) انعملوا على build مؤقت للـ production مش على سيرفر الـ dev. `src/content/projects.ts` رجع متل ما كان بالحرف، وانعمل build من جديد بعدها.
- **الـ JSON-LD:** [validator.schema.org](https://validator.schema.org) بدون أخطاء ولا تحذيرات: `ProfilePage` و`WebSite` و3 `CreativeWork` (والـ `Person` جوّاهم). الروابط `localhost` لحد ما يوصل الـ domain.
- **سيرفر الـ dev:** مرحلة Projects والمودال والـ lightbox بدون ولا رسالة بالـ console (لا hydration ولا DOM nesting).
- **الفحص كله على Chrome 154.** Safari وFirefox ما انفحصوا.
- **تصليحين بعد المرحلة (2026-10-09، بطلب صاحب الموقع).** CSS بس، بدون تغيير بالـ markup ولا بالـ JS. الاتنين كانوا مكتوبين هون كملاحظتين بدهم قرار:
  - **زر X تبع المودال** (`overlays.css`، تحت تعليق "إضافة عن المرجع"). كان ينضغط جوّا الـ flex تبع `.modal-head` لما العنوان يلف: 24×44 عالموبايل، و37 على 720 و42 على 1280 بمشروعين. المرجع نفسه هيك بمحتواه (28px على 375).
    - الزر صار `flex: none`، والنص هو اللي بيضيق (`min-width: 0`، و`overflow-wrap: break-word` للكلمة الأطول من السطر).
    - عالموبايل (719px ونازل) الراس صار grid: العنوان والزر بسطر، والوصف تحتهم على العرض كله. بدونها الوصف بينحشر بعمود ضاق 20px والراس بيطول.
    - حجم العنوان `clamp(10px, (100cqi - 60px) × 0.09, 14px)`: كلمة من 11 حرف ("Classifieds") بتضل على سطر واحد. بيصغر بس تحت 352px (11.16px على 320)، وفوقها 14px متل المرجع.
    - النتيجة على 17 عرض من 320 لـ 1280 وللمودالات التلاتة: الزر 44×44 دايماً وولا كلمة مكسورة. ارتفاع الراس ما زاد بولا حالة: على 720 وطالع نفسه (وراس مودال SooqSuria مطابق بالبكسل للي قبل)، وعالموبايل نفسه أو أقصر. على 375: 216 و242 و238 بدل 216 و268 و242. على 320: 224 و250 و294 بدل 268 و295 و317. وعلى 375 الفرق الوحيد بالبكسل براس مودال SooqSuria هو الزر نفسه.
  - **الـ lightbox** (`projects.css`). المشكلة طلعت أكبر من "بيطلع برّا الشاشة": عالموبايل بالعرض الراس والتذييل كانوا ياخدوا نص الارتفاع، فالصورة 237×148 على 667×375 و149×93 على 568×320، وسهمين التنقل بينضغطوا لحد 24px.
    - `max-height: calc(100svh - 24px)` بدل `none`، ومساحة الصورة `min-height: 0`، والراس والتذييل `flex: none`: إذا الـ caption طوّل النافذة، مساحة الصورة هي اللي بتقصر (والصورة بتضل كاملة) بدل ما النافذة تطلع برّا الشاشة.
    - `.lightbox .modal-win { padding: 0 }`: الـ `padding: 16px` تبع `.win` عالموبايل كان يصغّر الصورة ويزيد 32px عالارتفاع. الصورة على 375×667 صارت 306×191 بدل 274×171.
    - الأزرار `flex: none`، والـ caption `min-width: 0`.
    - شاشة عريضة وقصيرة (`max-height: 519px` مع `min-aspect-ratio: 3 / 2`، يعني موبايل بالعرض): الراس والتذييل بيصيروا لوحة 200px جنب الصورة، والصورة بتاخد الارتفاع كله. صارت 404×253 على 667×375، و305×191 على 568×320، و554×346 على 844×390 (كانت 293×183).
    - النتيجة: الـ 40 صورة على 34 مقاس شاشة (ديسكتوب، تابلت، موبايل بالطول وبالعرض، ومقاسات غريبة): النافذة جوّا الشاشة دايماً، الأزرار التلاتة 44×44 وظاهرة، والصورة والـ caption بدون قص. بمقاسين قصار كتير (600×260 و520×240) الـ caption بيعمل scroll بـ 10 صور من 40.
    - على 720px وطالع، ما عدا الشاشات القصيرة، نافذة الـ lightbox مطابقة بالبكسل للي قبل التصليح (9 مقاسات، صورتين لكل مقاس).
  - `cqi` و`container-type` بدهم Chrome 105 أو Safari 16 أو Firefox 110. المتصفح الأقدم بيتجاهل السطرين: العنوان بيضل 14px، ولوحة الـ lightbox بتاخد ارتفاع محتواها.
  - **بعد التصليح انعاد الفحص:** الـ 31 فحص تبع المودال والمعرض والـ 13 تبع الكيبورد ناجحين، و`lint` و`build` و`sprites:check` كمان. المقارنة مع المرجع انعادت بـ 52 حالة (والإضافات الجديدة انحطت بالمرجع متل باقي الإضافات): ولا فرق بالـ styles ولا بالبنية. بالبكسلات 45 حالة بدون ولا بكسل، و7 فيهم فرق جوّا صورة: 6 منهم من بكسل لـ 5 بكسلات، ووحدة فيها صورة مصغّرة كاملة بفرق خفيف (ولا بكسل فوق 32 من 255). هالحالة انعادت 8 مرات: 4 بدون ولا بكسل، و4 فيهم نفس الشي بصورة غير كل مرة.
  - **ظاهرة الصور انعرف وين بتيجي منها:** بكسلات الصورة بتتعلق بالمقاس اللي انعرضت فيه نفس الصورة قبل بنفس جلسة المتصفح، والسكربت بيمر على عروض كتير بجلسة وحدة (على الأغلب Chrome بيرجع يستعمل النسخة المصغّرة اللي عملها للمقاس السابق). انشافت بشكل ثابت: لقطة الـ lightbox على 900×520 بتختلف عن اللي قبل التصليح بنفس الـ 34,247 بكسل جوّا الصورة كل مرة بتنأخد بعد 900×519 (اللي صار إلها تصميم تاني ومقاس صورة تاني)، وبتطابقها تماماً لما تنأخد لحالها (3 مرات). يعني مش فرق بالـ CSS.
  - **سكربت المقارنة تعدّل** بهالجولة: صار يحمّل كل الصور المرسومة ويستنى الـ decode بالصفحتين قبل القياس (كل صور النسخة lazy، ولقطة الصفحة الكاملة بتوصل لصور لسا ما بلّشت)، وبيستنى 350ms بعد `cancel()` للـ animations قبل اللقطة.
- **تعديل محتوى بعد المرحلة (2026-10-09، بطلب صاحب الموقع): Chloéllia إله رابطين.** `links` صار فيه مفتاح تالت `live`: `demo` = `https://chloellia.davinda.dev/` (زر "Live demo" الدهبي، ببيانات كاملة) و`live` = `https://chloellia.com/` (زر "Live site"، ghost، لأن موقع الزبون بياناته لسا مش كاملة). شارة `accessNote` تبعه انشالت لأنها بتطلع بس لما ما في روابط. الزر الجديد بنفس classes زر "Source code" بالمرجع (`btn btn-ghost btn-small`) وتحت تعليق "إضافة عن المرجع"، وإذا مشروع إله `live` بدون `demo` بيطلع دهبي. `contentUpdatedAt` صار `2026-10-09`.
  - **Klardent (نفس اليوم، بطلب صاحب الموقع):** رابطه انتقل من `demo` لـ `live`، فزره صار "Live site" (دهبي، لأنو لحاله) بدل "Live demo": الموقع نظامي شغّال مش نسخة تجربة. بند الـ Definition of Done فوق ("Klardent: زر Live demo") مكتوب على الحالة وقت المرحلة.
  - **الفحص** (9 فحوص على الـ production build، والمواقع الخارجية stub): مودال SooqSuria متل ما كان؛ مودال Klardent فيه زر واحد دهبي "Live site" بيفتح `klardent.net` بتاب جديد؛ بمودال Chloéllia الزرّين بالترتيب والروابط الصح، كل واحد بيفتح تاب جديد بـ `opener` فاضي والمودال بيضل مفتوح، Tab بيمشي من الأول للتاني، وعلى 375px بينزلوا تحت بعض جوّا المودال. الرابطين بيردّوا 200 (بيحوّلوا على `/en`).
