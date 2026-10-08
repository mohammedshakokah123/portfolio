# خطة تصميم الـ Pixel Art: من `design/pixel art.html` لـ Next.js

هاد المجلد فيه خطة تحويل التصميم الجديد (`design/pixel art.html`: بورتفوليو على شكل لعبة منصّات) لنفس تطبيق الـ Next.js الموجود.
التصميم الجديد **بيستبدل** التصميم الأول كامل، **1:1 مع الملف**: الشخصية، الانتقالات، الجواهر، الصوت، والحركات المستمرة.

كل ملف بيمثّل **مرحلة وحدة**. نفّذها بالترتيب، وما تنتقل على المرحلة اللي بعدها قبل ما يتحقق الـ **Definition of Done** تبع المرحلة الحالية.

> خطة التصميم الأول صارت بـ [`docs/plan-v1/`](../plan-v1/README.md) (أرشيف).

## الفهرس

| # | الملف | المحتوى |
|---|------|---------|
| 00 | [00-overview.md](00-overview.md) | تحليل التصميم، القرارات، خريطة التغطية، هيكل المجلدات، الـ Conventions، الفروقات المقصودة، نقاط الخطر |
| 01 | [01-foundation.md](01-foundation.md) | الـ branch، حذف الواجهة القديمة، الخطوط، الـ tokens، الـ CSS الأساسي، الـ boot script |
| 02 | [02-sprites.md](02-sprites.md) | خرائط الـ sprites بـ TS، المولّد، `sprites.generated.css`، فحص التطابق مع المرجع |
| 03 | [03-ui-kit.md](03-ui-kit.md) | الـ kit (win / btn / chip / tags / ico) وصفحة المعاينة المؤقتة `/kit` |
| 04 | [04-content.md](04-content.md) | الأنواع والمحتوى: أيقونات الـ pixel، نصوص المراحل، الحقول الجديدة |
| 05 | [05-world-hud.md](05-world-hud.md) | العالم (سما، غيوم، جبال، أرض)، الـ HUD، نهار/ليل، الـ ground bar |
| 06 | [06-stage-engine.md](06-stage-engine.md) | محرك المراحل: الـ router، الشخصية، الـ wipe، الصوت، قائمة الـ pause |
| 07 | [07-title-about.md](07-title-about.md) | شاشة البداية ومرحلة About |
| 08 | [08-skills-experience.md](08-skills-experience.md) | مرحلة Skills (inventory) ومرحلة Experience (خريطة + quests) |
| 09 | [09-projects.md](09-projects.md) | الكارتريدج، مودال المشروع، المعرض |
| 10 | [10-contact.md](10-contact.md) | الروابط، الفورم، الـ credits |
| 11 | [11-gems.md](11-gems.md) | الجواهر والعدّاد وجدول الأصوات |
| 12 | [12-seo-a11y-performance.md](12-seo-a11y-performance.md) | الأيقونة، صورة OG، الـ 404، بدون JS، الطباعة، axe، Lighthouse، التنضيف الأخير |
| 13 | [13-deploy.md](13-deploy.md) | النشر على Vercel والأرشفة بمحركات البحث |

## متابعة التقدّم

- [x] 01: الواجهة القديمة انشالت، الخطين ظاهرين، والـ boot script بيحط حالة الصفحة قبل أول paint
  - `npm run format` ما اشتغل متل ما هو: بيعيد تنسيق `design/pixel art.html` (من 2614 لـ 5269 سطر) و`design/reference.html` وكل `docs/` و`CLAUDE.md`. اشتغل `npx prettier --write src package.json` بداله.
  - ⏳ مستني منك: نضيف `design/` و`docs/` و`public/` و`CLAUDE.md` لـ `.prettierignore` (اللي بتخلقه المرحلة 02)؟ لحد ما تقرر، الـ format بيضل على `src` بس.
  - الباقي بـ "ملاحظات التنفيذ" بآخر [01-foundation.md](01-foundation.md).
- [x] 02: `npm run sprites:check` مطابق للمرجع byte-by-byte
  - بالـ production الـ minifier بيشيل علامات التنصيص من `url("…")`. نص الـ SVG بالـ 60 متغير مطابق للمرجع (انفحص بالمتصفح)، والتفاصيل بآخر [02-sprites.md](02-sprites.md).
- [x] 03: الـ kit مطابق للمرجع على `/kit`
  - الفرق الوحيد بالـ computed styles: `appearance: button` على `<button>` (من الـ preflight، والمرجع `auto`). بدون أثر بصري، والتفاصيل بآخر [03-ui-kit.md](03-ui-kit.md).
- [x] 04: المحتوى كله بأيقونات الـ pixel، و`lucide-react` انشالت
- [ ] 05: العالم والـ HUD مطابقين بالنهار والليل
- [ ] 06: التنقل بين المراحل بكل الطرق (HUD، أسهم، Back/Forward، رابط مباشر)
- [ ] 07: شاشة البداية وAbout
- [ ] 08: Skills وExperience
- [ ] 09: الكارتريدج والمودال والمعرض
- [ ] 10: الفورم بيبعت إيميل حقيقي
- [ ] 11: الجواهر محفوظة والعدّاد شغال
- [ ] 12: axe بدون أخطاء، Lighthouse مقيوس، وما ضل ولا ملف من التصميم الأول
- [ ] 13: الموقع live ومسجّل بـ Search Console وBing

## ⏳ مستنيين من صاحب الموقع

| المعلومة | وين بتنحط | ملاحظة |
|---------|-----------|--------|
| هل لسا شغّال بـ Davinda؟ | `davinda.period.end` بـ `src/content/experience.ts` | هلق `"2026-09"`، فالشارة بتطلع "Quest complete". إذا لسا شغّال: `null` وبتصير "Current quest" |
| تهجئة الاسم | `site.name` و`site.alternateNames` | الموقع "Mohammad Shaquqa"، وملف الـ CV اسمه "Mouhammad-Shakokah". لازم تهجئة وحدة بكل مكان |
| الصورة الشخصية (مربعة، 480×480 أو أكبر) | `public/profile.jpg` + `site.profileImage` | لحد ما توصل بيطلع راس الشخصية الـ pixel مكانها |
| الإيميل، LinkedIn، GitHub، الـ domain | `src/content/site.ts` | الجدول الكامل بـ [13-deploy.md](13-deploy.md) |

## أوامر سريعة

```bash
npm run dev            # سيرفر التطوير على http://localhost:3000 (بيولّد الـ sprites أول)
npm run build          # build للـ production (لازم ينجح بآخر كل مرحلة)
npm run start          # تشغيل الـ build
npm run lint           # ESLint
npm run format         # Prettier
npm run sprites        # بيولّد src/styles/pixel/sprites.generated.css من src/pixel/ (من المرحلة 02)
npm run sprites:check  # بيتأكد إنو الناتج مطابق للملف المرجعي وإنو الملف المولّد محدّث
```

## قاعدة عامة لكل مرحلة

1. اقرأ ملف المرحلة كامل قبل ما تبلّش، واقرأ [00-overview.md](00-overview.md) مرة وحدة قبل المرحلة 01.
2. **المرجع هو `design/pixel art.html`.** افتحه بالمتصفح مباشرة (double click) بتاب جنب `localhost:3000`. أرقام الأسطر بهالخطة محسوبة على نسخة الـ commit `04412b1`.
3. الـ CSS والـ JS بينتقلوا **متل ما هم**. أي تعديل مسموح مكتوب بملف المرحلة. إذا لقيت حالك عم تغيّر شي مش مكتوب، وقّف واسأل.
4. بالآخر شغّل `npm run format` وبعدها `npm run lint && npm run build` (و`npm run sprites:check` من المرحلة 02). كود الخطة مجرّب: بيمرق `tsc` و`eslint` متل ما هو، و`format` بس بيعيد لف بعض الأسطر.
5. **قارن بالعين** مع المرجع على العروض: 375، 768، 1024، 1280، 1440، 1680، **بالنهار وبالليل**. هالعروض بتغطي كل breakpoints التصميم (379، 479، 719، 859، 1023، 1239، 1399، 1599).
6. جرّب كل مرحلة كمان بـ `prefers-reduced-motion: reduce` (DevTools ← Rendering) وبالكيبورد لحاله.
7. علّم المرحلة بـ `[x]` بهالملف، واكتب تحتها أي شي تغيّر عن الخطة وقت التنفيذ (متل ما عملنا بـ v1).
