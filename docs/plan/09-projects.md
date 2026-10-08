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
- [ ] 3 كارتريدج بعمودين (والتالت لحاله بالصف التاني)، وعمود واحد من 859px ونازل.
- [ ] الهيكل الرمادي مع الخطوط فوق، والملصق الورقي جوّاه: الصورة (5:2 بدون قص)، العنوان، الوصف.
- [ ] hover: الكارتريدج بيطلع 4px وبياخد ظل (بخطوات).
- [ ] الـ tags غامقة (`--ink`)، والزر دهبي صغير.
- [ ] جرّب مؤقتاً `nda: true` لمشروع ← شارة "NDA" الدهبية فوق الصورة، وبالمودال "Internal system, under NDA". رجّعها.
- [ ] جرّب مؤقتاً `cover: null` ← الـ placeholder بالتدرّج والأيقونة ونص "Screenshot". رجّعها.

**المودال:**
- [ ] "View details" بيفتحه بحركة pop، الخلفية بتغمق، والصفحة ما بتعمل scroll من وراه.
- [ ] العنوان والعنوان الفرعي فوق، وزر X. المحتوى بيعمل scroll جوّا المودال.
- [ ] الأقسام بالترتيب: Overview، Architecture، Key technical features، Stack، Screenshots، وبعدها الأزرار.
- [ ] Klardent: زر "Live demo" بيفتح بتاب جديد. SooqSuria وChloéllia: شارة الـ `accessNote` + "Request a walkthrough".
- [ ] "Request a walkthrough": المودال بيتسكّر وبيصير الانتقال لـ Contact.
- [ ] Esc، زر X، والضغط برّا المودال: التلاتة بيسكّروه، والـ focus بيرجع لزر "View details" تبعه.
- [ ] فتحه، نزول لآخره، تسكيره، وفتحه مرة تانية: بيفتح من أوله.
- [ ] Back بالمتصفح والمودال مفتوح: بيتسكّر والمرحلة بتتبدّل.

**المعرض:**
- [ ] الصور المصغّرة بعمودين (وعمود عالموبايل) مع caption، وأول صورة "Overview".
- [ ] كبسة على صورة: الـ lightbox بيفتح **فوق** المودال، والصورة كاملة جوّا الشاشة.
- [ ] الأسهم (كيبورد وأزرار) بتبدّل الصورة وبتلف من الآخر للأول، والعدّاد "3 / 15" بيتحدّث. والمرحلة **ما** بتتبدّل بالأسهم.
- [ ] Esc بيسكّر الـ lightbox **بس**، والمودال بيضل مفتوح، والـ focus بيرجع للصورة المصغّرة.

**الأداء والـ SEO:**
- [ ] تاب الـ Network (فلتر Img)، فتح `/`: ولا صورة من `/projects/`. بعد الانتقال لـ Projects: الـ 3 covers بس. بعد فتح مودال: صوره المصغّرة الظاهرة بس.
- [ ] View Source للرئيسية: نصوص الـ Overview والـ Architecture تبع الـ 3 مشاريع موجودة بالـ HTML.
- [ ] الـ JSON-LD فيه 3 عناصر `CreativeWork` (افحصه بـ [validator.schema.org](https://validator.schema.org) بلصق الكود).

**عام:**
- [ ] كل شي فوق بالكيبورد لحاله، بدون ماوس.
- [ ] `npm run lint && npm run build && npm run sprites:check` ناجحين.
