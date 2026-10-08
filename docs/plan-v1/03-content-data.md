# 03: فصل المحتوى (Content Layer)

## الهدف
كل النصوص والروابط والبيانات تكون بملفات TypeScript typed بـ `src/content/`، والمكونات بس بتعرضها. هيك تعديل أي معلومة (إيميل، مشروع جديد...) بيصير بمكان واحد.

## الخطوات

### ✅ 1. `src/types/content.ts`
المرجع هو الملف نفسه. أهم القرارات فيه:

| الحقل | النوع | ليش |
|------|------|-----|
| `email`، `socials.linkedin`، `socials.github` | `string \| null` | `null` = لسا ما وصل. TypeScript بيجبر المكوّن يتعامل معه (يخفي الرابط)، فما بيطلع رابط مكسور أو `mailto:TODO`. |
| `url` | `string` | بدون `/` بالآخر (راجع `resolveSiteUrl` بـ `site.ts`). |
| `sections` | `Record<"about" \| "skills" \| "experience" \| "projects" \| "contact", { title; description? }>` | عناوين الأقسام ووصفها ← `SectionHeading`. |
| `hero.ctas` | `{ primary, secondary }` | "View projects" و"Get in touch". |
| `about.paragraphs` | `RichText[]` | كل فقرة array من `string` أو `{ emphasis }`. هيك الملف بيضل `.ts` بدون JSX، والنص serializable. |
| `footer.credit` | `string` | "B.Sc. Software Engineering, Latakia University." |
| `ExperienceItem.period` | `{ start: string; end: string \| null }` | `"YYYY"` أو `"YYYY-MM"` للـ `<time dateTime>`. `end: null` = لهلق (بدل `current`). النص بيتولّد بـ `formatPeriod`. |
| `Project.image` | `{ src; alt } \| null` | الـ alt بيتكتب مع الصورة. لما `null` منستعمل `placeholderLabel` كـ `aria-label`. |

> **ملاحظة:** الأيقونات (`LucideIcon`) بتنعرض بس جوّا **Server Components**. إذا احتجت تبعت شي لمكوّن client، ابعته كـ `children` مش كـ prop.

### ✅ 2. `src/content/site.ts`
منقول **حرفياً** من `design/reference.html`:
- الاسم والدور والـ `description` (من `<meta name="description">`) والـ `ogDescription` (من `og:description`)
- `url`: بالترتيب `NEXT_PUBLIC_SITE_URL`، بعدين `NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL` (Vercel بيعطيه تلقائياً)، وبالآخر `localhost`. هيك build على Vercel ما بيطلع فيه `localhost` حتى لو نسيت المتغيّر. المسافات بتنشال، وإذا الرابط بدون `https://` بينضاف تلقائياً، وبيرجع الـ origin بس (حروف صغيرة وبدون `/` بالآخر). وأي رابط غلط بيوقّف الـ build برسالة واضحة.
- الإيميل والروابط `null` لحد ما يوصلوا (مرحلة 11)
- `location` و`cvPath` و`nav` و`sections` و`hero` (مع `ctas` و3 quick facts و`glance`) و`about` و`footer`

**كل معلومة بمكان واحد:**
- `name` و`role` و`availability` و`engineeringYears` (`"3+"`، **بتعدّله بإيدك**، مش محسوب) ثوابت فوق الملف، ومنها بيتبنى الـ description والـ keywords والـ hero والـ glance.
- المدة (`productionYears`) وسنين الجامعة من `experience.ts`، و`formatYears` بيكتب `year` أو `years` حسب الرقم.
- `footer.credit` من `university.title` و`university.org`.

> **كل الروابط اللي عليها `TODO`** رح يبعتها صاحب الموقع لاحقاً. ولا تعتمد على الروابط التخمينية اللي بالتصميم.

### ✅ 3. `src/content/skills.ts`
4 مجموعات بنفس الترتيب: Frontend frameworks (`Code`)، UI & styling (`Palette`)، State & data fetching (`Database`)، Tools & ecosystem (`Wrench`).

### ✅ 4. `src/content/experience.ts`
عنصرين (`davinda` و`university`، ومصدّرين لحالهم):
- Frontend Developer at Davinda: من `2025-02` لـ `2026-09` (خلص الشغل)، مع tech badges. الـ highlights بصيغة الماضي.
- B.Sc. in Software Engineering at Latakia University: من `2020` لـ `2026`.

و`productionYears` بتنحسب من تواريخ Davinda بـ `yearsBetween`. الحساب بيشمل شهر النهاية، متل ما بتنقرا "Feb 2025 – Sep 2026" (يعني 20 شهر). والنتيجة مقرّبة **لتحت** لأقرب نص سنة، هيك ما منكبّر الخبرة: 20 شهر ← `1.5`، و17 ← `1`، وأقل من 6 شهور ← `<1`.

`davinda` معرّف بـ `satisfies ExperienceItem`، يعني TypeScript بيعرف إنه `end` مش `null`. إذا رجعت عالشغل وصار `end: null`، حساب `productionYears` بيطلع خطأ compile وبتنتبه عليه.

الـ helpers بـ `src/lib/dates.ts`: `formatYearMonth` و`formatPeriod` و`yearsBetween` و`formatYearCount` و`formatYears`. إذا التاريخ سنة بس (`"YYYY"`)، بالبداية بينحسب من أول السنة وبالنهاية لآخرها. كلهم بيقبلوا `"YYYY"` أو `"YYYY-MM"` بس. أي تاريخ غلط (متل `"2026-13"`)، أو `end` قبل `start`، بيوقّف الـ build برسالة واضحة بدل ما يطلع `undefined` بالصفحة.

### ✅ 5. `src/content/projects.ts`
4 مشاريع، **الـ slugs**:

| slug | العنوان | icon | nda |
|------|---------|------|-----|
| `pos-inventory` | POS & Inventory Management System | `ScanBarcode` | true |
| `ecommerce-platform` | E-Commerce Platform | `ShoppingCart` | false |
| `operations-dashboard` | Real-time Operations Dashboard | `LayoutDashboard` | true |
| `ui-component-library` | Internal UI Component Library | `Component` | false |

النصوص منقولة من الـ `<template id="tpl-...">` (الأسطر 663 لـ 798 بالمرجع)، والـ `placeholderLabel` من `aria-label` تبع الـ placeholder بالكروت.

- `projects` نوعها `readonly Project[]`، يعني `.sort()` عليها بيطلع خطأ TypeScript (انسخ الأول: `[...projects].sort()`).
- `getAdjacentProjects` بترجّع `{ prev: null, next: null }` إذا الـ slug مش موجود.
- `projectLabels`: النصوص الثابتة بالكروت وصفحة التفاصيل ("View details"، عناوين الأقسام، "Internal system, under NDA"، "No public demo available"، "Request a walkthrough"، "Live demo"، "Source code").
- **مشروع بدون روابط طبيعي:** يا ما إلو رابط عام، يا هو داشبورد خاص ما بينعرض. بيضل `links: {}`، وصفحة التفاصيل بتعرض "No public demo available" مع "Request a walkthrough" (التفاصيل بالمرحلة 07).

## الملفات
`src/types/content.ts` و`src/lib/dates.ts` و`src/content/site.ts` و`src/content/skills.ts` و`src/content/experience.ts` و`src/content/projects.ts`

## Definition of Done
- [x] كل نصوص المحتوى من المرجع منقولة بدون ما ينقص شي (قارن قسم بقسم). **برّا الـ scope:** نصوص الواجهة العامة (labels الفورم وplaceholders ورسائله، و`aria-label`، و"Skip to content"، وأزرار الـ header والـ footer) بتضل بالمكونات تبعها.
- [x] `npx tsc --noEmit` بدون أخطاء.
- [x] كل نص رح تحتاجه مكونات `sections/` إلو حقل بـ `src/content/` (`sections` و`hero.ctas` و`footer` و`projectLabels`). التأكد إنه ما في نص hard-coded بيصير بالمراحل الجاية.
