# 13: النشر على Vercel والأرشفة بمحركات البحث

## الهدف
الموقع (بالتصميم الجديد) live على Vercel، والفورم شغال على الـ production، وكل الـ placeholders انستبدلت، والموقع مسجّل بـ Google وBing ومربوط بحساباتك، مشان يطلع أول نتيجة لما حدا يبحث عن اسمك.

> هي نفس مرحلة النشر تبع v1 (`docs/plan-v1/11-deploy.md`) اللي ما تنفّذت، معدّلة للتصميم الجديد: صفحة وحدة بدل صفحات المشاريع، ومع خطوة الدمج لـ `main`.

## 1. الروابط والمعلومات المطلوبة (صاحب الموقع بيبعتها)

> ⏳ **مستنيين:** عبّي هالجدول لما توصل المعلومات، وبعدين حدّث `src/content/site.ts` (بدّل الـ `null` بالقيمة الحقيقية). الروابط اللي `null` ما بتنعرض، فالموقع ما بينكسر لحد ما تتعبّى.

| المعلومة | المكان بالكود | القيمة |
|---------|---------------|--------|
| رابط LinkedIn | `site.socials.linkedin` | ⏳ TODO (هلق `null`) |
| رابط GitHub | `site.socials.github` | ✅ `https://github.com/mohammedshakokah123` (2026-10-09) |
| حسابات تانية (X، Stack Overflow، dev.to، Medium...) | `site.socials.others` | ✅ Facebook: `https://www.facebook.com/mohammed.shakokah` (2026-10-09). الباقي اختياري |
| رقم الاتصال والواتساب | `site.phone` و`site.whatsapp` | ✅ `+963 933 981 269` (محلياً 0933 981 269، نفس الرقم للاتنين) (2026-10-09) |
| الإيميل العام للتواصل | `site.email` | ⏳ TODO (هلق `null`) |
| **تهجئة الاسم** | `site.name`، `site.shortName`، `site.alternateNames`، واسم ملف الـ CV | ✅ الكنية انحسمت (2026-10-09): الموقع صار "Mohammad Shakokah"، متل ملف الـ CV وحساب GitHub. ⏳ ضل الاسم الأول: ملف الـ CV "Mouhammad"، والحسابات "mohammed" (القسم 6) |
| هل لسا شغّال بـ Davinda؟ | `davinda.period.end` بـ `src/content/experience.ts` | ⏳ هلق `"2026-09"` ← الشارة "Quest complete" |
| الـ Domain | `NEXT_PUBLIC_SITE_URL` | ⏳ TODO |
| روابط المشاريع | `links` بـ `src/content/projects.ts` | ✅ Klardent إله Live site (`klardent.net`، موقع نظامي). Chloéllia إله رابطين (من 2026-10-09): Live demo على `chloellia.davinda.dev` (بيانات كاملة) وLive site على `chloellia.com` (موقع الزبون، بياناته لسا مش كاملة). SooqSuria بدون رابط عام (`accessNote`) |

**ملفات:**

| الملف | المكان | الحالة |
|------|--------|--------|
| الـ CV | `public/cv/Mouhammad-Shakokah-CV.pdf` + `site.cvPath` | ✅ موجود (راجع التهجئة فوق) |
| Screenshots المشاريع والـ covers | `public/projects/*/` | ✅ موجودين للـ 3 مشاريع |
| الصورة الشخصية (مربعة، 480×480 أو أكبر) | `public/profile.jpg` + `site.profileImage: "/profile.jpg"` | ⏳ لحد ما توصل بيطلع راس الشخصية الـ pixel |

> `sameAs` بالـ JSON-LD بيتجاهل أي رابط ما بيبلّش بـ `http`، فالـ `null` ما بتخرّب شي.
> بعد أي تعديل بالمحتوى: حدّث `contentUpdatedAt` بـ `src/content/site.ts`.

## 2. الدمج لـ `main`
> ✅ **انعمل بـ 2026-10-09، بطريقة أقصر بطلب صاحب الموقع:** `main` انعمله fast-forward لـ `feat/pixel-art` وانرفع لحاله (`git push origin main`)، بدون PR وبدون رفع الـ branch. انعمل قبل ما تخلص المرحلة 12 (الجزء المرئي منها بس كان جاهز)، مشان النشر يصير بسرعة. الخطوات تحت هي الطريقة الأصلية، للمرات الجاية.

الـ repo موجود على GitHub (`origin`)، وVercel بينشر من `main`.
```bash
git switch feat/pixel-art
npm run lint && npm run build && npm run sprites:check   # آخر فحص

git push -u origin feat/pixel-art
```
افتح Pull Request على `main` من صفحة الـ repo على GitHub (رابط الإنشاء بيطلع بـ output الـ `push`). الـ `gh` CLI مش مثبّت على هالجهاز؛ إذا تثبّت: `gh pr create --base main --title "feat: pixel art redesign"`.

راجع الـ **Preview URL** اللي Vercel بيحطه عالـ PR (بعد القسم 3)، وبعدين ادمج.

> الـ repo **Public** أحسن للبورتفوليو: الكود نفسه بيصير مشروع بيقدر يشوفه أي حدا بدو يوظّفك.

## 3. Vercel
1. [vercel.com/new](https://vercel.com/new) ← Import الـ repo.
2. الـ Framework بيتعرّف لحاله (Next.js).
3. **Node.js Version** (Settings ← Build and Deployment): 22.x أو 24.x. الـ `prebuild` بيشغّل مولّد الـ sprites، وهو بيحتاج Node ≥ 22.18 (مكتوب بـ `engines` بالـ `package.json`).
4. **Environment Variables** (Production + Preview):

   | Key | Value |
   |-----|-------|
   | `RESEND_API_KEY` | `re_…` |
   | `CONTACT_TO_EMAIL` | إيميلك |
   | `CONTACT_FROM_EMAIL` | `Portfolio <contact@yourdomain.com>` |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` (**بدون** `/` بالآخر) |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | من القسم 5 |
   | `NEXT_PUBLIC_BING_SITE_VERIFICATION` | من القسم 5 |

5. Deploy.

> إذا `NEXT_PUBLIC_SITE_URL` ناقص، الـ build بيوقف برسالة واضحة (بقصد: canonical وsitemap غلط أسوأ من build فاشل).

## 4. الـ Domain (**منصوح فيه بقوة للـ SEO**)
- **الأفضل:** domain فيه اسمك، بنفس التهجئة اللي اعتمدتها. لما حدا يبحث عن اسمك، الـ domain المطابق إشارة قوية.
- **خطوات:**
  1. اشتري الـ domain (Vercel Domains، Namecheap، Cloudflare...).
  2. Vercel ← Project ← Settings ← Domains ← ضيفه.
  3. خلّي نسخة وحدة هي الأساسية (مثلاً بدون `www`)، والتانية تعمل **redirect 308** عليها. Vercel بيعملها لحاله.
  4. عدّل الـ DNS عند المزوّد حسب تعليمات Vercel.
  5. حدّث `NEXT_PUBLIC_SITE_URL` واعمل Redeploy.
  6. **Resend:** اعمل verify لنفس الـ domain (SPF/DKIM) وغيّر `CONTACT_FROM_EMAIL`.
- **أرشفة الـ `*.vercel.app`:** الـ canonical بيدل على الـ domain الأساسي، وهاد كافي بالعادة مشان ما يصير في نسختين بـ Google.

## 5. تسجيل الموقع بمحركات البحث

### Google Search Console
1. [search.google.com/search-console](https://search.google.com/search-console) ← **Add property**.
2. اختار **URL prefix** (`https://yourdomain.com`) ← طريقة التحقق **HTML tag**.
3. انسخ قيمة الـ `content` بس ← حطها بـ `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` بـ Vercel ← Redeploy ← **Verify**.
   > (أو اختار **Domain property** مع تحقق عن طريق DNS TXT record، وهيك بتغطي كل الـ subdomains.)
4. **Sitemaps** ← ابعت `sitemap.xml` (فيه رابط واحد: الرئيسية).
5. **URL Inspection** ← حط الرابط الرئيسي ← **Request indexing**.
6. بعد أسبوع لأسبوعين: شيك **Pages** (شو انأرشف) و**Performance** (شو الكلمات اللي عم يطلعلك فيها).

> الموقع صفحة وحدة والمراحل بالـ hash (`/#projects`). Google بيتجاهل اللي بعد الـ `#`، فكل المراحل وتفاصيل المشاريع بتنأرشف كصفحة وحدة. مشان هيك كل النصوص موجودة بالـ HTML من السيرفر (المرحلة 12).

### Bing Webmaster Tools (بيغطي Bing وDuckDuckGo وYahoo)
1. [bing.com/webmasters](https://www.bing.com/webmasters) ← **Import from Google Search Console**، وهيك بتخلص بخطوة وحدة.
2. أو بشكل يدوي: تحقق بالـ meta tag (`NEXT_PUBLIC_BING_SITE_VERIFICATION`) وابعت الـ sitemap.

## 6. الربط من حساباتك لموقعك (Backlinks) ⭐
هاد هو **أهم شي** مشان Google يتأكد إنه الموقع إلك، ويطلع بالبحث عن اسمك مع حساباتك.

| المنصة | شو تعمل |
|-------|---------|
| **LinkedIn** | Edit profile ← **Contact info** ← Website ← ضيف رابط الموقع (نوع: Portfolio). وضيفه كمان بقسم **Featured** كـ Link. |
| **LinkedIn (Custom URL)** | خلّي رابط البروفايل باسمك بدون أرقام، وحدّثه بـ `site.socials.linkedin`. |
| **GitHub** | Settings ← Profile ← **Website** ← رابط الموقع. |
| **GitHub Profile README** | اعمل repo باسم الـ username تبعك، وفيه `README.md` بيعرّف عنك مع رابط الموقع. |
| **GitHub repo تبع البورتفوليو** | حط رابط الموقع بـ **About ← Website** تبع الـ repo. |
| **حسابات تانية** | X، Stack Overflow، dev.to، Medium... أي حساب عندك ضيف فيه رابط الموقع، وضيفه لـ `site.socials.others`. |
| **الـ CV** | حط رابط الموقع بأول الـ CV (جنب الإيميل). |
| **توقيع الإيميل** | رابط الموقع. |

> **استعمل نفس الاسم بالضبط بكل مكان** ونفس الصورة الشخصية. هالشي بيساعد Google يربط الحسابات ببعض.
> الكنية صارت وحدة بكل مكان: "Shakokah" (الموقع من 2026-10-09، ملف الـ CV، وحساب GitHub `mohammedshakokah123`). الاسم الأول لسا بتلات أشكال: "Mohammad" (الموقع)، "Mouhammad" (ملف الـ CV)، و"mohammed" (الحسابات). اعتمد واحد، وحط الباقي بـ `site.alternateNames` مشان اللي بيبحث فيهم يلاقيك.

## 7. فحص ما بعد النشر
- [ ] المراحل الست بتفتح بالتنقل وبالرابط المباشر (`/#about`، `/#skills`، `/#experience`، `/#projects`، `/#contact`)، وBack/Forward شغالين.
- [ ] زر الـ CV بينزّل الملف (بالـ HUD، بشاشة البداية، وبمرحلة Contact).
- [ ] مودالات الـ 3 مشاريع بتفتح، والمعرض والـ lightbox شغالين، وزر "Live site" تبع Klardent بيفتح، وزرّين Chloéllia ("Live demo" و"Live site") كمان.
- [ ] `/xyz` و`/projects/klardent-dental-lab-saas` ← صفحة "Game over".
- [ ] **الفورم:** ابعت رسالة حقيقية وتأكد إنها وصلت (وشوف الـ Spam).
- [ ] الصوت، الليل، والجواهر بينحفظوا بعد refresh.
- [ ] الـ OG preview على [opengraph.xyz](https://www.opengraph.xyz) و[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/): صورة الـ pixel الجديدة.
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) على الـ URL الحقيقي: `Person` و`ProfilePage` بدون أخطاء.
- [ ] [Schema Markup Validator](https://validator.schema.org) على الرئيسية: `Person`، `ProfilePage`، `WebSite`، و3 `CreativeWork`، بدون أخطاء.
- [ ] [PageSpeed Insights](https://pagespeed.web.dev) على الـ URL الحقيقي (Mobile وDesktop). قارن مع أرقام localhost المكتوبة بالمرحلة 12. الحكم النهائي هون، مش على localhost.
- [ ] جرّب على موبايل حقيقي (iOS + Android)، بالنهار وبالليل: الانتقال سلس، الخطين ظاهرين، والأزرار بتنكبس بسهولة.

## 8. المتابعة (بعد النشر)

| الوقت | شو تشيك |
|------|---------|
| بعد 3 لـ 7 أيام | Search Console ← Pages: الصفحة الرئيسية انأرشفت؟ |
| بعد أسبوعين | ابحث بـ Google عن اسمك بين `""` وعن `site:yourdomain.com` |
| كل شهر | Search Console ← Performance: شو الكلمات والـ CTR |
| لما تضيف مشروع | ضيفه لـ `src/content/projects.ts` مع صوره (cover 5:2، والباقي 16:10)، حدّث `contentUpdatedAt`، و**Request indexing** للرئيسية |

> **توقعات واقعية:** الأرشفة بتاخد من أيام لأسابيع. الظهور أول نتيجة لاسمك بيصير أسرع إذا الـ domain باسمك وحساباتك كلها بتربط عليه.

## Definition of Done
- [ ] `feat/pixel-art` مدموج بـ `main`.
- [ ] الموقع live على domain (أو `*.vercel.app`).
- [ ] جدول القسم 1 كامل، وما ضل ولا `TODO` (`git grep -n "TODO" -- src`).
- [ ] Search Console وBing: الموقع verified والـ sitemap مبعوت.
- [ ] LinkedIn وGitHub (وأي حساب تاني) فيهم رابط الموقع، وبنفس تهجئة الاسم.
- [ ] الفورم بيبعت إيميلات من الـ production.
- [ ] قائمة فحص ما بعد النشر (القسم 7): كلها.
- [ ] كل push على `main` بيعمل deploy تلقائي، وكل PR إله Preview URL.
