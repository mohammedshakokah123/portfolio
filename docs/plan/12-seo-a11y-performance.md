# 12: SEO وAccessibility وPerformance والتنضيف الأخير

## الهدف
الموقع الجديد بنفس مستوى v1 بالـ SEO والـ Accessibility، مقيوس بالأرقام، وبدون أي أثر للتصميم الأول: أيقونة الموقع وصورة الـ OG وصفحة الـ 404 بشكل pixel، الصفحة مقروءة بدون JS وبالطباعة، axe بدون أخطاء، وLighthouse مقيوس ومكتوب.

## الفكرة
- **اللي بيضل من v1 بدون تغيير:** الـ metadata (title، description، canonical، Open Graph، Twitter، robots، verification)، الـ `robots.ts`، والـ JSON-LD (`Person`، `ProfilePage`، `WebSite`، ومعهم `CreativeWork` لكل مشروع من المرحلة 09). تفاصيل القرارات بـ `docs/plan-v1/10-seo-a11y-performance.md`.
- **اللي بيتغيّر:** كل شي مرئي (الأيقونة، صورة الـ OG، الـ 404)، وطريقة القياس: المراحل المخفية `display: none`، فـ axe وLighthouse ما بيشوفوا غير المرحلة الظاهرة. **كل فحص بينعاد لكل مرحلة.**
- **الأهداف نفس v1** (Lighthouse ≥ 95 بالأربع فئات، SEO = 100، صفر أخطاء axe). إذا بند ما بيتحقق **بسبب التصميم نفسه** (متل خط 8px)، بينكتب بجدول "اللي ما تحقق" بآخر الملف مع السبب، وما بينخبّى ولا بيتغيّر التصميم بدون موافقة.

## الخطوات

### 1. أيقونة الموقع (راس الشخصية)
المرجع فيه الأيقونة كـ data URI (السطر 13). منطلّعها ملف، ومنولّد منها أيقونة Apple:
```bash
# icon.svg من المرجع، حرف بحرف
node -e "const fs=require('fs');const m=fs.readFileSync('design/pixel art.html','utf8').match(/<link rel=\"icon\" href=\"data:image\/svg\+xml,([^\"]+)\"/);fs.writeFileSync('src/app/icon.svg',decodeURIComponent(m[1])+'\n')"

# apple-icon.png: 180×180. الـ viewBox 18×18، فـ density 720 = تكبير ×10 بالضبط (حواف حادة).
# الخلفية سماوية لأن iOS بيعبّي الشفاف أسود
node -e "require('sharp')('src/app/icon.svg',{density:720}).flatten({background:'#7EC7F7'}).png().toFile('src/app/apple-icon.png')"

# الـ favicon القديم (شعار v1). المتصفحات بتاخد icon.svg
git rm src/app/favicon.ico
```
> `sharp` موجودة أصلاً مع Next (ما في تثبيت).

### 2. `src/app/layout.tsx`: الـ viewport
متل ما هو من المرحلة 01 (`themeColor: "#14142B"`). تأكد إنو الـ `viewport` القديم (لونين مع `prefers-color-scheme` و`colorScheme: "dark light"`) ما ضل: النهار/الليل صار من `data-time`، والـ `color-scheme` بـ `tokens.css`.

### 3. صورة الـ OG بشكل pixel

**الخط:** `ImageResponse` بيحتاج ملف الخط نفسه (ما بيقرأ `next/font`).
```bash
mkdir -p src/assets/fonts
curl -L -o src/assets/fonts/PressStart2P-Regular.ttf \
  https://github.com/google/fonts/raw/main/ofl/pressstart2p/PressStart2P-Regular.ttf
```
(الرخصة OFL: مسموح ينحط بالـ repo.)

**`src/lib/seo/og-card.tsx`** (استبدل الملف كله):
```tsx
import { HEAD, HERO_PAL } from "@/pixel/sprites/hero";
import type { Palette, PixelMap } from "@/pixel/svg";

/**
 * sprite مرسوم بمستطيلات (نفس خوارزمية svg(): مستطيل لكل مجموعة بكسلات متتالية بنفس اللون).
 * satori (محرك ImageResponse) ما بيرسم CSS variables ولا background-image من الـ stylesheet.
 */
function Sprite({ map, pal, scale }: { map: PixelMap; pal: Palette; scale: number }) {
  const rects: React.ReactNode[] = [];
  map.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") {
        x++;
        continue;
      }
      let n = 1;
      while (row[x + n] === c) n++;
      rects.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: x * scale,
            top: y * scale,
            width: n * scale,
            height: scale,
            background: pal[c],
          }}
        />,
      );
      x += n;
    }
  });

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        width: map[0].length * scale,
        height: map.length * scale,
      }}
    >
      {rects}
    </div>
  );
}

/**
 * صورة الـ OG (1200×630): سما، راس الشخصية، الاسم بسطرين (أبيض ودهبي) متل شاشة البداية، وأرض.
 * بتترسم بـ ImageResponse (satori): styles inline بس، وأي div فيه أكتر من ولد لازم يكون display: flex.
 * كل النص بخط Press Start 2P: لا تستعمل رموز برّا الـ ASCII (متل "·")، بتطلع مربعات.
 */
export function OgCard({
  name,
  role,
  stack,
  host,
}: {
  name: string;
  role: string;
  stack: string;
  host: string;
}) {
  const [first, ...rest] = name.toUpperCase().split(" ");
  const shadow = "6px 6px 0 #14142B";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#7EC7F7",
        color: "#fff",
        fontFamily: "Press Start 2P",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 56, padding: "72px 80px 0" }}>
        <Sprite map={HEAD} pal={HERO_PAL} scale={14} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, textShadow: shadow }}>{first}</div>
          <div style={{ fontSize: 64, marginTop: 18, color: "#FFC83D", textShadow: shadow }}>
            {rest.join(" ")}
          </div>
          <div style={{ fontSize: 24, marginTop: 32, color: "#14142B" }}>{role.toUpperCase()}</div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 80px 36px",
          fontSize: 20,
          color: "#14142B",
        }}
      >
        <div>{stack}</div>
        <div>{host}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", height: 96 }}>
        <div style={{ height: 24, background: "#58C44B" }} />
        <div style={{ flex: 1, background: "#B0622F" }} />
      </div>
    </div>
  );
}
```

**`src/app/opengraph-image.tsx`** (استبدل الملف كله):
```tsx
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";

import { site } from "@/content/site";
import { OgCard } from "@/lib/seo/og-card";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} | ${site.role}`;

export default async function OpengraphImage() {
  const pressStart = await readFile(
    join(process.cwd(), "src/assets/fonts/PressStart2P-Regular.ttf"),
  );

  return new ImageResponse(
    <OgCard
      name={site.name}
      role={site.role}
      stack="React / Next.js / TypeScript"
      host={new URL(site.url).host}
    />,
    {
      ...size,
      fonts: [{ name: "Press Start 2P", data: pressStart, weight: 400, style: "normal" }],
    },
  );
}
```

### 4. صفحة الـ 404: `src/app/not-found.tsx`
```tsx
import type { Metadata } from "next";
import Link from "next/link";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";

// الـ robots صريح: غير هيك بيورث "index, follow" من الـ layout جنب الـ noindex اللي Next بيحطه لحاله
export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/**
 * stage-solo: بتضل ظاهرة مهما كان data-stage (stages.css). الـ HUD والعالم من الـ layout.
 * روابط المراحل بالـ HUD هون بتودّي عالرئيسية (router.ts: onHome)، وGameRoot بيعيد تشغيل المحرك بعد الرجوع.
 */
export default function NotFound() {
  return (
    <section className="stage stage-solo" aria-labelledby="not-found-title">
      <div className="stage-inner home-inner">
        <p className="stage-no">Error 404</p>
        <h1 id="not-found-title" className="stage-title">
          Game over
        </h1>
        <div className="win home-win">
          <p className="lead">This stage doesn&apos;t exist.</p>
          <p className="muted">
            The page you&apos;re looking for was moved, or it was never part of the map.
          </p>
        </div>
        <Link className={btn({ size: "start" })} href="/">
          <PixelIcon name="play" />
          Continue
        </Link>
      </div>
    </section>
  );
}
```

### 5. بدون JS والطباعة: `src/styles/pixel/fallbacks.css` (ملف جديد، مش من المرجع)
```css
/* ملف مش من المرجع: الصفحة بدون JS، والطباعة. آخر import قبل keyframes. */

/* ---------- بدون JS: المراحل كلها ظاهرة تحت بعض، والروابط #about بتشتغل كـ anchors عادية ---------- */

/* عناصر بتحتاج JS: منخبّيها بدل ما تضل أزرار ميتة */
html:not([data-js])
  :is(.gem, .hint, .hud-gems, .menu-btn, .sound-btn, .time-btn, .portrait-toggle, [data-dialog]) {
  display: none;
}

/* تفاصيل المشاريع (مودالات مسكّرة) بتنعرض نوافذ عادية بآخر الصفحة، مشان المحتوى يضل مقروء */
html:not([data-js]) dialog.modal[id^="project-"] {
  position: static;
  display: block;
  width: min(100% - 40px, 780px);
  max-height: none;
  margin: 0 auto 26px;
}
html:not([data-js]) dialog.modal[id^="project-"] .modal-win {
  max-height: none;
}
html:not([data-js]) dialog.modal[id^="project-"] :is([data-close], .shots) {
  display: none;
}
/* الأرض fixed وقدّام المحتوى: آخر نافذة لازم تطلع فوقها */
html:not([data-js]) main {
  padding-bottom: calc(var(--ground-h) + 26px);
}

/* ---------- الطباعة (Ctrl+P / PDF): كل المراحل وتفاصيل المشاريع، بدون العالم والـ HUD ---------- */
@media print {
  *,
  *::before,
  *::after {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact; /* النوافذ غامقة ونصها أبيض: بدون ألوان الخلفية النص بيختفي */
  }
  .world,
  .hero-layer,
  .floor,
  .hud,
  .ground-bar,
  .wipe,
  .toast,
  .skip,
  .gem,
  .hint,
  .portrait-toggle,
  .shots,
  [data-dialog],
  [data-close] {
    display: none !important;
  }
  html[data-js] .stage {
    display: block;
    min-height: 0;
    padding: 0 20px 26px;
  }
  dialog.modal[id^="project-"] {
    position: static;
    display: block;
    width: auto;
    max-height: none;
    margin: 0 20px 26px;
  }
  dialog.modal[id^="project-"] .modal-win {
    max-height: none;
  }
  .modal-body {
    overflow: visible;
  }
  .win,
  .cart {
    break-inside: avoid;
  }
}
```
وبـ `src/app/globals.css` ضيف السطر بعد `responsive.css`:
```css
@import "../styles/pixel/fallbacks.css" layer(components);
```
وبـ `src/components/layout/hud.tsx` ضيف class لزر الليل مشان القاعدة فوق تلاقيه:
```tsx
<TimeToggle className={btn({ variant: "ghost", size: "icon" }, "time-btn")} />
```

### 6. التنضيف الأخير
```bash
git rm -r src/app/kit                     # صفحة المعاينة المؤقتة (المرحلة 03)

# ولا واحد من هدول لازم يرجّع نتيجة
git grep -n "lucide-react\|radix-ui\|next-themes\|sonner\|tw-animate\|shadcn\|data-reveal" -- src package.json
git grep -n "/projects/\[" -- src         # روابط لصفحات المشاريع المحذوفة
git grep -n "مؤقت:\|ثابت لهلق" -- src   # أي كود مؤقت نسيناه

npm ls --depth=0                          # الحزم: next react react-dom + react-hook-form @hookform/resolvers zod resend cn
```
- `src/content/site.ts`: حدّث `contentUpdatedAt` لتاريخ اليوم (بيطلع بالـ sitemap وبالـ JSON-LD).
- احذف ملفات `.gitkeep` من المجلدات اللي صار فيها ملفات.

### 7. فحص الـ SEO

| الفحص | المتوقع |
|-------|---------|
| View Source لـ `/` | `<title>` و`<meta name="description">` و`<link rel="canonical">` متل v1 |
| `h1` | واحد بس: `Mohammad Shaquqa` |
| النصوص | كل نصوص المراحل الست وتفاصيل الـ 3 مشاريع موجودة بالـ HTML الخام (مش بس بعد الـ JS) |
| `/sitemap.xml` | رابط واحد (الرئيسية) |
| `/robots.txt` | متل v1 |
| `/opengraph-image` | الصورة الجديدة: السما، الراس، الاسم بسطرين، الأرض. والنص كله حروف (ولا مربع) |
| JSON-LD | `Person`، `ProfilePage`، `WebSite`، و3 `CreativeWork`. بدون أخطاء على [validator.schema.org](https://validator.schema.org) |
| `/kit` و`/projects/klardent-dental-lab-saas` | 404 بشكل pixel |

### 8. فحص الـ Accessibility

**axe** (extension الـ axe DevTools) على **كل مرحلة لحالها**، بالنهار وبالليل (12 فحص)، ومرة والـ pause مفتوح، ومرة ومودال مشروع مفتوح.

**نقاط حساسة بهالتصميم، افحصها بإيدك حتى لو axe ساكت:**

| البند | ليش حساس | الحل المسموح إذا فشل |
|------|----------|----------------------|
| `.credits-mini` (8px، `#FFE4C7` فوق التراب `#B0622F`) | التباين حوالي 3.7:1، تحت الـ 4.5:1 | اللون ← `#fff` (4.5:1). النص مكرر بنافذة الـ credits، فممكن كمان `aria-hidden` |
| النص الأبيض فوق السما (`.title-logo`، `.stage-title`، `.title-class`) | مقروء بفضل الـ outline الأسود (`text-shadow`)، بس الأدوات بتقيس الأبيض عالأزرق | ما بيتغيّر. بينكتب بجدول "اللي ما تحقق" مع صورة |
| الخط 8px (`.hint`، `.stats dt`، `.link-text b`، الشارات) | أصغر من الـ 12px اللي Lighthouse بيعتبره مقروء | ما بيتغيّر بدون موافقة: هو شكل التصميم. بينكتب بالجدول |
| `.stage-sub` فوق السما بالنهار وبالليل | لونه بيتبدّل مع `--on-sky` | لازم ينجح بالحالتين |
| الأزرار تحت 720px | 38–40px | الحد الأدنى 24px (WCAG 2.2)، فهي ناجحة |

**بالكيبورد لحاله، من أول الصفحة لآخرها:**
- [ ] Skip link ← عنوان المرحلة.
- [ ] كل الـ HUD، كل مرحلة، قائمة الـ pause، مودال مشروع، الـ lightbox، الفورم.
- [ ] الـ focus ظاهر دايماً (outline زهري 3px)، وما بيضيع بعد أي انتقال أو تسكير مودال أو جمع جوهرة.
- [ ] الـ focus ما بيفوت على العالم ولا الشخصية ولا الـ blocks.

**قارئ الشاشة (NVDA أو Narrator)، مرة وحدة عالأقل:**
- [ ] الـ landmarks: banner (الـ HUD)، navigation "Stages"، main، contentinfo (الـ ground bar).
- [ ] بعد كل انتقال بيقرأ "Stage 2: Skills".
- [ ] أزرار الصوت والليل بتقول حالتها (pressed / not pressed).
- [ ] عدّاد الجواهر: "Bonus gems found: 2/5".
- [ ] أخطاء الفورم بتنقرأ مع الحقل، ونتيجة الإرسال بتنقرأ لحالها.

**بدون JS** (DevTools ← Settings ← Disable JavaScript):
- [ ] المراحل الست تحت بعض بالترتيب، وبعدها تفاصيل الـ 3 مشاريع كنوافذ.
- [ ] الرسمات كلها ظاهرة (العالم، الأيقونات، الإطارات): الـ sprites ملف CSS.
- [ ] روابط الـ HUD (على 1280px) بتنزل للمرحلة، والعنوان مش مخبّى ورا الـ HUD.
- [ ] ما في أزرار ميتة: لا جواهر، لا Menu، لا صوت، لا ليل، لا "View details".
- [ ] الفورم ظاهر (الإرسال بيحتاج JS، متل v1).

**الطباعة** (Ctrl+P ← Save as PDF):
- [ ] كل المراحل وتفاصيل المشاريع، بدون الـ HUD والعالم والأرض. النوافذ بألوانها والنص مقروء، وما في نافذة مقسومة بين صفحتين.

**`prefers-reduced-motion`:**
- [ ] ولا حركة مستمرة (غيوم، نجوم، شخصية، جواهر، وميض)، والتبديل بين المراحل فوري.

### 9. فحص الـ Performance
على الـ production build، بنافذة Incognito:
```bash
npm run build && npm run start
```
Lighthouse (Mobile وبعدين Desktop) على `/`: **3 مرات وخد الوسيط**. وبعدها مرة على `/#projects`.

| اللي بتقيسه | المتوقع | إذا طلع أسوأ |
|-------------|---------|--------------|
| Performance | ≥ 95 | شوف الـ LCP والـ TBT تحت |
| Accessibility / Best Practices | 100 | الـ report بيسمّي العنصر |
| SEO | 100 | إذا البند "legible font sizes": بينكتب بالجدول تحت |
| CLS | 0 | الخطين: `next/font` بيحط fallback مقيوس. تأكد إنو ما في request لـ Google Fonts |
| LCP | نص نافذة شاشة البداية أو الاسم | إذا الاسم هو الـ LCP ومتأخر: حركة الحروف بتبلّش من `opacity: 0`. قيس مع `prefers-reduced-motion` للمقارنة، واكتب الفرق |
| TBT | قريب من الصفر | الـ JS صار أقل من v1 (بدون radix وsonner وnext-themes وlucide). سجّل حجم الـ First Load JS من output الـ `npm run build`، وإذا بدك تقارن: `git switch main && npm run build` |
| حجم `sprites.generated.css` | حوالي 10KB بعد الضغط | تاب الـ Network، عمود الـ Size |
| الصور عند فتح `/` | ولا صورة مشروع | المرحلة 09 |

### 10. جولة أخيرة على كل شي
مرور واحد من أول الصفحة لآخرها على 375px وعلى 1440px، بالنهار وبالليل، والمرجع مفتوح جنبها:
- [ ] شاشة البداية، About، Skills، Experience، Projects، Contact: كل وحدة مطابقة.
- [ ] الانتقالات، الأسهم، Back/Forward، الرابط المباشر.
- [ ] الصوت، الليل، الجواهر: التلاتة بينحفظوا بعد refresh.
- [ ] مودال مشروع والـ lightbox.
- [ ] رسالة حقيقية من الفورم.
- [ ] `/xyz` ← "Game over"، وزر Continue بيرجّع للرئيسية والمحرك شغّال (جرّب انتقال بعد الرجوع).

## اللي ما تحقق (عبّيه وقت التنفيذ)
أي هدف ما وصلناله، مع السبب والقرار. فاضي = كل شي تحقق.

| البند | الهدف | اللي طلع | السبب | القرار |
|------|-------|----------|-------|--------|
| | | | | |

## الملفات
`src/app/{icon.svg,apple-icon.png,opengraph-image.tsx,not-found.tsx}`، `src/lib/seo/og-card.tsx`، `src/assets/fonts/PressStart2P-Regular.ttf`، `src/styles/pixel/fallbacks.css`، `src/app/globals.css`، `src/components/layout/hud.tsx`، `src/content/site.ts`، وحذف `src/app/favicon.ico` و`src/app/kit/`

## Definition of Done
- [ ] أيقونة التاب راس الشخصية، و`/apple-icon.png` 180×180 بخلفية سماوية.
- [ ] `/opengraph-image` بالشكل الجديد.
- [ ] `/xyz` ← صفحة "Game over" مع الـ HUD والعالم.
- [ ] جدول فحص الـ SEO (القسم 7): كل الصفوف.
- [ ] axe: صفر violations على المراحل الست بالنهار وبالليل، ومع الـ pause ومودال مشروع.
- [ ] قوائم الكيبورد، قارئ الشاشة، بدون JS، الطباعة، وreduced motion (القسم 8): كلها.
- [ ] Lighthouse مقيوس ومكتوبة أرقامه بـ `README.md` تحت المرحلة 12 (Mobile وDesktop).
- [ ] جدول "اللي ما تحقق" معبّى (أو فاضي عن حق).
- [ ] الجولة الأخيرة (القسم 10): كلها.
- [ ] أوامر التنضيف (القسم 6) ما بترجّع شي، و`npm run lint && npm run build && npm run sprites:check` ناجحين.
