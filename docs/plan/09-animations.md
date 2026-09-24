# 09: الحركات بـ Motion (على الخفيف)

## الهدف
حركات **هادية وقصيرة** بتعطي إحساس بالجودة بدون ما تلهي عن المحتوى أو تبطّئ الموقع. التصميم الأصلي قايم على البساطة، والحركة لازم تخدم هالشي.

## المبادئ
| القاعدة | القيمة |
|--------|--------|
| المدة | 0.3 لـ 0.5 ثانية |
| الـ Easing | `easeOut` أو `[0.21, 0.47, 0.32, 0.98]` |
| المسافة | 12 لـ 16px (fade-up) |
| الـ Stagger | 0.06 لـ 0.08 ثانية بين العناصر |
| التكرار | **مرة وحدة** (`once: true`) |
| ممنوع | parallax، حركات مستمرة (loop)، حركة على النص الطويل، أي حركة بتعمل layout shift |

## 1. الـ Provider: `src/components/motion/motion-provider.tsx`
```tsx
"use client";
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
```
- **`LazyMotion` + `m`**: بيخفف الـ bundle كتير مقارنة بـ `motion.*`.
- **`strict`**: بيطلّع خطأ إذا حدا استعمل `motion.div` بالغلط بدل `m.div`.
- **`reducedMotion="user"`**: إذا المستخدم مفعّل `prefers-reduced-motion`، الـ transforms بتتوقف وبيضل بس الـ opacity.

الاستيراد بالمكونات:
```tsx
import * as m from "motion/react-m";
```

## 2. `Reveal`: `src/components/motion/reveal.tsx`
fade-up لما العنصر يدخل الشاشة:
```tsx
"use client";
import * as m from "motion/react-m";

export function Reveal({ children, delay = 0, className }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </m.div>
  );
}
```
**وين منستعمله:** على محتوى كل section (About، Skills، Experience، Projects، Contact)، يعني بنلف الـ `SectionHeading` بـ `Reveal`، والمحتوى بـ `Reveal delay={0.1}`.

## 3. `Stagger`: `src/components/motion/stagger.tsx`
للقوائم (كروت المهارات، كروت المشاريع، عناصر الـ timeline، الـ principles):
```tsx
"use client";
import * as m from "motion/react-m";
import type { Variants } from "motion/react";

const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function Stagger({ children, className, as = "div" }: {
  children: React.ReactNode; className?: string; as?: "div" | "ul" | "ol";
}) {
  const Comp = m[as];
  return (
    <Comp className={className} variants={container} initial="hidden"
          whileInView="show" viewport={{ once: true, margin: "-80px" }}>
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = "div" }: {
  children: React.ReactNode; className?: string; as?: "div" | "li" | "article";
}) {
  const Comp = m[as];
  return <Comp className={className} variants={staggerItem}>{children}</Comp>;
}
```
> بما إنه `Stagger` بيقبل `as="ul"` و`StaggerItem` بيقبل `as="li"`، الـ semantic HTML بيضل سليم.
> الأقسام بتضل **Server Components**، وبس بتلف أجزاءها بهي الـ wrappers.

## 4. الحركات المطلوبة

### أ. Hero (عند التحميل)
- Stagger للعناصر: badge ← h1 ← lead ← quick facts ← CTA (`initial="hidden" animate="show"` بدل `whileInView`).
- الـ GlanceCard: `initial={{ opacity: 0, scale: 0.98 }}` ← `animate={{ opacity: 1, scale: 1 }}` مع `delay: 0.2`.
- ⚠️ **ما منحرّك الـ h1 بـ opacity من 0** إذا بيأثر على الـ LCP. الأحسن حركة `y` صغيرة مع opacity تبلّش من `0.01`، أو ما منحرّك الـ h1 أبداً ومنحرّك الباقي. **قيس الـ LCP بعد التطبيق.**

### ب. الأقسام (`Reveal` / `Stagger`)
| القسم | الحركة |
|------|--------|
| About | `Reveal` للفقرات + `Stagger` للـ 3 principles |
| Skills | `Stagger` على الـ 4 articles |
| Experience | `Stagger as="ol"` + `StaggerItem as="li"` |
| Projects | `Stagger` على الكروت |
| Contact | `Reveal` للعمود اليساري + `Reveal delay={0.1}` للفورم |

### ج. Nav indicator (`desktop-nav.tsx`)
خلفية خفيفة بتتزحلق للرابط النشط:
```tsx
{isActive && (
  <m.span layoutId="nav-active"
          className="absolute inset-0 -z-10 rounded-md bg-muted"
          transition={{ type: "spring", stiffness: 380, damping: 30 }} />
)}
```
> الـ `Link` لازم يكون `relative`. و`layout` animations بتحتاج `domMax` بدل `domAnimation`. إذا ما بدك تكبّر الـ bundle، استبدلها بـ CSS transition عادي على `aria-[current=true]:bg-muted`. **القرار:** جرّب `domMax` وقيس الفرق بالـ bundle، وإذا أكتر من ~15KB استعمل CSS.

### د. Project card hover: `src/components/motion/hover-lift.tsx`
```tsx
"use client";
export function HoverLift({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <m.div className={className} whileHover={{ y: -4 }} transition={{ duration: 0.2, ease: "easeOut" }}>
      {children}
    </m.div>
  );
}
```
بتلف فيه الـ `ProjectCard` (والـ border بيتغير بالـ CSS متل ما هو).

### هـ. Theme toggle
دوران وfade للأيقونة وقت التبديل (`AnimatePresence mode="wait"` مع `key={resolvedTheme}`، `rotate: -90 ← 0`). بعد الـ mount بس (مشان الـ hydration).

### و. Mobile menu
الـ Sheet عنده حركة جاهزة (tw-animate-css)، فما في داعي لـ Motion.

## 5. ملاحظات SEO وSSR
- العناصر اللي عليها `initial={{ opacity: 0 }}` بتنرسم بالـ HTML من السيرفر (النص موجود للـ crawlers)، بس بتكون مخفية بصرياً لحد ما يتحمّل الـ JS.
- هاد مقبول لأن الحركات قصيرة والـ JS صغير. بس **ما منطبّق هالشي على الـ Hero** بطريقة بتأخر ظهور الـ h1 (شوف 4-أ).

## Definition of Done
- [ ] كل الحركات ≤ 0.5 ثانية، ومرة وحدة بس.
- [ ] بـ `prefers-reduced-motion: reduce` (من DevTools ← Rendering) ما في حركة transform.
- [ ] Lighthouse: الـ CLS = 0، والـ LCP ما تأثر (قارن قبل وبعد).
- [ ] ما في `motion.*`، كله `m.*` (الـ `strict` بيضمن هالشي).
- [ ] حجم الـ JS تبع الصفحة الرئيسية معقول (افحص output الـ `npm run build`).
