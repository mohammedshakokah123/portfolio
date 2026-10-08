# 03: الـ UI Kit (نوافذ، أزرار، chips، tags، أيقونات)

## الهدف
القطع اللي كل المراحل مبنية منها: النافذة (`.win`)، الزر (`.btn`)، الـ chip، الـ tags، والأيقونة (`.ico`)، مع صفحة معاينة مؤقتة `/kit` نقارن فيها مع المرجع قبل ما نبني فوقهم.

## الفكرة
- الـ CSS بينتقل متل ما هو لـ `kit.css`. الإطارات بـ `border-image` من الـ sprites (`--frame-win`، `--frame-gold`، `--frame-1`).
- **ما منعمل مكوّن React لكل class.** `.win` و`.chip` بينكتبوا مباشرة بالـ JSX (`<div className="win">`) متل المرجع، فالـ markup بيضل مقروء جنبه. المكوّنات بس للي بيتكرر بمنطق:
  - `PixelIcon`: اسم الأيقونة typed، ودايماً `aria-hidden`.
  - `btn()`: function بترجّع الـ classes، بتنحط على `<a>` أو `<button>`.
  - `Tags`: قائمة مع `aria-label`.

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 750–757 `.ico` `.ico.lg` `.ico.xl` | `src/styles/pixel/kit.css` |
| 762–773 `.win` `.win-gold` `.win-title` | `src/styles/pixel/kit.css` |
| 775–795 `.btn` وكل الـ variants | `src/styles/pixel/kit.css` |
| 797–804 `.chip` | `src/styles/pixel/kit.css` |
| 806–810 `.tags` | `src/styles/pixel/kit.css` |

## الخطوات

### 1. `src/styles/pixel/kit.css`
انقل الأسطر 750–757 وبعدها 762–810 **بدون أي تعديل**، وبنفس الترتيب.

> `.btn-start` (السطر 1044) مش هون: بقسم الـ TITLE SCREEN، فبيروح لـ `home.css` بالمرحلة 07.
> `.chip-green` (السطر 1047) كمان بـ `home.css`.

### 2. `src/components/pixel/pixel-icon.tsx`
```tsx
import { cn } from "@/lib/utils";
import type { PixelIconName } from "@/pixel/sprites/icons";

type PixelIconProps = {
  name: PixelIconName;
  /** بدون = 18px، lg = 27px، xl = 54px (مضاعفات الـ 9 بكسل تبع الأيقونة) */
  size?: "lg" | "xl";
  className?: string;
};

/**
 * أيقونة pixel بلون النص (CSS mask على currentColor).
 * زينة دايماً (aria-hidden): المعنى بييجي من النص اللي جنبها أو من aria-label الأب.
 */
export function PixelIcon({ name, size, className }: PixelIconProps) {
  return <span aria-hidden="true" className={cn("ico", `i-${name}`, size, className)} />;
}
```

### 3. `src/components/pixel/btn.ts`
```ts
import { cn } from "@/lib/utils";

type BtnOptions = {
  /** gold الزر الأساسي، ghost فوق النوافذ، dark للـ ground bar */
  variant?: "gold" | "ghost" | "dark";
  /** small جوّا الكروت، icon مربع 44px، start زر "Press start" الكبير */
  size?: "md" | "small" | "icon" | "start";
};

const VARIANT = { gold: "", ghost: "btn-ghost", dark: "btn-dark" } as const;
const SIZE = { md: "", small: "btn-small", icon: "btn-icon", start: "btn-start" } as const;

/** classes الزر، لـ <a> أو <button>: `className={btn({ variant: "ghost", size: "small" })}` */
export function btn({ variant = "gold", size = "md" }: BtnOptions = {}, className?: string) {
  return cn("btn", VARIANT[variant], SIZE[size], className);
}
```

### 4. `src/components/pixel/tags.tsx`
```tsx
/** الـ badges تبع التقنيات. الـ label بينقرأ بقارئ الشاشة قبل القائمة ("Technologies used") */
export function Tags({ items, label }: { items: readonly string[]; label?: string }) {
  return (
    <ul className="tags" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
```

### 5. صفحة المعاينة المؤقتة: `src/app/kit/page.tsx`
بتنحذف بالمرحلة 12. الـ `noindex` احتياط لو انتشرت بالغلط.
```tsx
import type { Metadata } from "next";

import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { Tags } from "@/components/pixel/tags";
import { FRAMES } from "@/pixel/sprites/frames";
import { ICONS, type PixelIconName } from "@/pixel/sprites/icons";

export const metadata: Metadata = { title: "UI kit", robots: { index: false } };

const iconNames = Object.keys(ICONS) as PixelIconName[];
const row = { display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" } as const;

export default function KitPage() {
  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "48px 20px 160px", display: "grid", gap: 26 }}>
      <div className="win">
        <h2 className="win-title">Window</h2>
        <p>Default window: navy panel, white pixel frame with notched corners.</p>
      </div>

      <div className="win win-gold">
        <h2 className="win-title">Gold window</h2>
        <p>Used for the current quest.</p>
      </div>

      <div className="win">
        <h2 className="win-title">Buttons</h2>
        <div style={row}>
          <button type="button" className={btn()}>
            <PixelIcon name="mail" />
            Gold
          </button>
          <button type="button" className={btn({ variant: "ghost" })}>
            <PixelIcon name="download" />
            Ghost
          </button>
          <button type="button" className={btn({ variant: "dark" })}>
            Dark
            <PixelIcon name="arrow-right" />
          </button>
          <button type="button" className={btn({ size: "small" })}>
            Small
          </button>
          <button type="button" className={btn({ variant: "ghost", size: "icon" })} aria-label="Icon button">
            <PixelIcon name="moon" />
          </button>
          <button type="button" className={btn({ variant: "ghost", size: "icon" })} aria-pressed="true" aria-label="Pressed">
            <PixelIcon name="sun" />
          </button>
        </div>
      </div>

      <div className="win">
        <h2 className="win-title">Chips and tags</h2>
        <ul style={row}>
          <li className="chip">
            <PixelIcon name="cap" />
            Chip with an icon
          </li>
          <li className="chip">
            <PixelIcon name="briefcase" />
            Another chip
          </li>
        </ul>
        <div style={{ marginTop: 16 }}>
          <Tags items={["React", "Next.js", "TypeScript"]} label="Sample tags" />
        </div>
      </div>

      <div className="win">
        <h2 className="win-title">Icons ({iconNames.length})</h2>
        <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 16 }}>
          {iconNames.map((name) => (
            <li key={name} style={{ display: "grid", justifyItems: "center", gap: 8, fontSize: 15 }}>
              <PixelIcon name={name} size="lg" />
              {name}
            </li>
          ))}
        </ul>
        <div style={{ ...row, marginTop: 20, color: "var(--teal)" }}>
          <PixelIcon name="bolt" />
          <PixelIcon name="bolt" size="lg" />
          <PixelIcon name="bolt" size="xl" />
        </div>
      </div>

      <div className="win">
        <h2 className="win-title">Frames ({FRAMES.length})</h2>
        <ul style={row}>
          {FRAMES.map(([name, map]) => (
            <li
              key={name}
              style={{
                padding: "8px 14px",
                background: "var(--panel-2) padding-box",
                border: `calc(${(map.length - 1) / 2} * var(--b)) solid transparent`,
                borderImage: `var(--frame-${name}) ${(map.length - 1) / 2} / calc(${(map.length - 1) / 2} * var(--b)) stretch`,
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```
> الـ slice تبع كل إطار = `(عرض الخريطة - 1) / 2`: إطارات 7×7 ← 3، 5×5 ← 2، 3×3 ← 1. نفس الأرقام اللي بالـ CSS (`border-image: var(--frame-win) 3 / …`).

### 6. نضّف الصفحة المؤقتة
بـ `src/app/page.tsx` شيل الـ sprites التجريبية تبع المرحلة 02 (صار في `/kit`).

## كيف تقارن مع المرجع
المرجع ما فيه صفحة kit، فالمقارنة عنصر بعنصر. افتح المرجع وافتح DevTools على التابين:

| العنصر | وين بالمرجع | شو تقارن (Computed) |
|--------|-------------|---------------------|
| `.win` | النافذة بشاشة البداية | `padding: 22px`، `border-width: 9px`، الزوايا المقصوصة |
| `.btn` | "Press start" و"Download CV" | `min-height: 46px`، `padding: 12px 18px`، الخط 12px، الـ bevel (فاتح فوق ويسار، غامق تحت ويمين) |
| `.btn:active` | اكبس وضل كابس | بينزل 2px والـ bevel بينقلب |
| `.btn-icon` | زر الليل بالـ HUD | 44×44 |
| `.btn[aria-pressed="true"]` | زر الليل وهو مفعّل | بيصير دهبي |
| `.chip` | الـ facts بشاشة البداية | `padding: 9px 14px`، الأيقونة دهبية |
| `.tags li` | مرحلة Experience | `padding: 4px 9px`، خط 15px/500، ظل داخلي تحت |
| `.ico` | أي أيقونة | 18px، وبتاخد لون النص |

## الملفات
`src/styles/pixel/kit.css`، `src/components/pixel/{pixel-icon.tsx,btn.ts,tags.tsx}`، `src/app/kit/page.tsx` (مؤقت)، `src/app/page.tsx` (تنضيف)

## Definition of Done
- [x] `/kit` بتعرض كل القطع، والـ 31 أيقونة كلهم ظاهرين (ولا مربع فاضي ولا مربع ملوّن كامل).
- [x] جدول المقارنة فوق: كل الصفوف مطابقة على 1280px.
- [x] على 375px: `.win` بتصير `padding: 16px` (من `responsive.css`)، والأزرار ما بتكسر الـ layout.
- [x] الـ 8 إطارات ظاهرين بألوانهم: أبيض، دهبي، أسود رفيع، أبيض/دهبي/أحمر للحقول، أزرق/دهبي للـ slots.
- [x] Tab عالأزرار ← outline زهري 3px (`--focus`).
- [x] `npm run lint && npm run build && npm run sprites:check` ناجحين.

## ملاحظات التنفيذ
- **الملفات انكتبت بسكربت:** الكود من الـ code blocks تبع هالملف، و`kit.css` من أسطر المرجع. بعد Prettier، `kit.css` = الأسطر 750–757 و762–810 بنفس التنسيق، حرف بحرف (انفحص آلياً).
- **طريقة المقارنة:** نفس الـ markup (كل classes الـ kit) انحقن بصفحة المرجع وبـ `/kit`، وانقارنت كل الـ computed properties (571 خاصية لـ 25 عنصر) مع المقاسات، على 1280px و375px. الـ hover والـ active والـ focus-visible انقارنوا كمان، وطلعوا مطابقين.
- **الفرق الوحيد: `appearance: button` على `<button>`.** من الـ preflight تبع Tailwind (المرجع `auto`). بدون أثر بصري: الزر إله background وborder، ومقاساته مطابقة للمرجع.
- **فروقات من الـ preflight بدون أثر:** `tab-size: 4`، و`-webkit-tap-highlight-color: transparent` على كل العناصر (مكتوبة بجدول المرحلة 01)، و`border-style: solid` بعرض 0.
- **لقياس الـ hover بالـ headless** لازم قراءتين بينهم 300ms: الـ transition (`steps(2)`) بيبلّش عند أول قراءة للـ style.
- **`npm run build` وسيرفر الـ dev شغّال:** `/kit` رجّعت 500 مرة وحدة بالـ dev وقت الـ build، وما تكررت بعدها (9 محاولات، ومنها بعد `npm run sprites`).
