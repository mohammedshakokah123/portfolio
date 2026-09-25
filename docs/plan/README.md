# خطة بناء الـ Portfolio: Next.js + TypeScript + shadcn/ui + Tailwind + Motion

هاد المجلد فيه خطة تحويل التصميم الموجود (كان `Index (1).html`، وهلق صار بـ `design/reference.html`) لموقع Next.js كامل.
كل ملف بيمثّل **مرحلة وحدة**. نفّذها بالترتيب، وما تنتقل على المرحلة اللي بعدها قبل ما يتحقق الـ **Definition of Done** تبع المرحلة الحالية.

## الفهرس

| # | الملف | المحتوى |
|---|------|---------|
| 00 | [00-overview.md](00-overview.md) | تحليل التصميم، الـ Stack، هيكل المجلدات، الـ Conventions |
| 01 | [01-setup.md](01-setup.md) | إنشاء المشروع وتثبيت الحزم وshadcn |
| 02 | [02-design-tokens-and-theme.md](02-design-tokens-and-theme.md) | الألوان والـ tokens وDark/Light |
| 03 | [03-content-data.md](03-content-data.md) | فصل المحتوى بملفات TypeScript typed |
| 04 | [04-layout-header-footer.md](04-layout-header-footer.md) | الـ Layout والـ Header والـ Mobile nav والـ Footer |
| 05 | [05-hero-about.md](05-hero-about.md) | قسم Hero وقسم About |
| 06 | [06-skills-experience.md](06-skills-experience.md) | قسم Skills وقسم Experience (timeline) |
| 07 | [07-projects.md](07-projects.md) | كروت المشاريع + صفحة `/projects/[slug]` |
| 08 | [08-contact.md](08-contact.md) | الفورم + Server Action + Resend |
| 09 | [09-animations.md](09-animations.md) | حركات Motion الخفيفة |
| 10 | [10-seo-a11y-performance.md](10-seo-a11y-performance.md) | الـ SEO والـ Accessibility والأداء |
| 11 | [11-deploy.md](11-deploy.md) | النشر على Vercel |

## متابعة التقدّم

- [x] 01: المشروع شغّال و`npm run build` ناجح
- [ ] 02: الثيمين شغالين بدون flash والألوان مطابقة
- [ ] 03: كل المحتوى بـ `src/content/`
- [ ] 04: الـ Header والـ Nav (desktop و mobile) والـ Footer
- [ ] 05: Hero وAbout
- [ ] 06: Skills وExperience
- [ ] 07: كروت المشاريع وصفحات التفاصيل (4 صفحات static)
- [ ] 08: الفورم بيبعت إيميل حقيقي
- [ ] 09: الحركات مع احترام `prefers-reduced-motion`
- [ ] 10: Lighthouse ≥ 95 (SEO = 100)، والـ JSON-LD سليم، وما في أخطاء axe
- [ ] 11: الموقع live، ومسجّل بـ Search Console وBing، وحساباتك بتربط عليه

## ⏳ مستنيين من صاحب الموقع
روابط LinkedIn وGitHub وباقي الحسابات، والإيميل، وطرق كتابة الاسم، والـ domain، وروابط المشاريع، والصورة، والـ CV.
الجدول الكامل بـ [11-deploy.md](11-deploy.md#1-الروابط-والمعلومات-المطلوبة-صاحب-الموقع-بيبعتها). بالكود كلهم معلّمين بـ `TODO`.

## أوامر سريعة

```bash
npm run dev      # سيرفر التطوير على http://localhost:3000
npm run build    # build للـ production (لازم ينجح بآخر كل مرحلة)
npm run start    # تشغيل الـ build
npm run lint     # ESLint
npm run format   # Prettier
```

## قاعدة عامة لكل مرحلة

1. اقرأ ملف المرحلة كامل قبل ما تبلّش.
2. ارجع للمرجع `design/reference.html` بكل ما بدك تنقل نص أو class.
3. بالآخر شغّل `npm run lint && npm run build`، وافحص بالمتصفح على عرض 375px و1280px بالثيمين.
