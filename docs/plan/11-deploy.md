# 11: النشر على Vercel والأرشفة بمحركات البحث

## الهدف
الموقع live على Vercel، والفورم شغال على الـ production، وكل الـ placeholders انستبدلت، والموقع مسجّل بـ Google وBing ومربوط بحساباتك، مشان يطلع أول نتيجة لما حدا يبحث عن اسمك.

## 1. الروابط والمعلومات المطلوبة (صاحب الموقع بيبعتها)

> ⏳ **مستنيين:** عبّي هالجدول لما توصل الروابط، وبعدين حدّث `src/content/site.tsx` و`src/content/projects.ts`.

| المعلومة | المكان بالكود | القيمة |
|---------|---------------|--------|
| رابط LinkedIn | `site.socials.linkedin` | ⏳ TODO |
| رابط GitHub | `site.socials.github` | ⏳ TODO |
| حسابات تانية (X، Stack Overflow، dev.to، Medium...) | `site.socials.others` | ⏳ TODO (اختياري) |
| الإيميل العام للتواصل | `site.email` | ⏳ TODO (هلق `example.com` ❌) |
| طرق كتابة الاسم (إنجليزي/عربي) | `site.alternateNames` | ⏳ TODO |
| الـ Domain | `NEXT_PUBLIC_SITE_URL` | ⏳ TODO |
| روابط Demo/Source للمشاريع اللي مش NDA | `projects.ts` ← `links` | ⏳ TODO (هلق `#` ❌) |

**ملفات لازم تنحط:**
| الملف | المكان |
|------|--------|
| الصورة الشخصية (مربعة، 640×640 أو أكبر) | `public/profile.jpg` + `site.profileImage` |
| الـ CV | `public/cv/Mohammad-Shaquqa-CV.pdf` |
| Screenshots المشاريع (1280×800، webp) | `public/projects/*.webp` + `project.image` |

> إذا مشروع ما إله رابط، خلّي `links: {}` وما رح تنعرض الأزرار.
> `sameAs` بالـ JSON-LD بيتجاهل أي رابط ما بيبلّش بـ `http`، فالـ TODO ما بتخرّب شي لحد ما تتعبّى.

## 2. GitHub
```bash
git add .
git commit -m "feat: portfolio ready for deploy"
gh repo create portfolio --public --source=. --push
```
> **Public** أحسن للبورتفوليو: الـ repo نفسه بيصير مشروع بيقدر يشوفه أي حدا بدو يوظّفك.

## 3. Vercel
1. [vercel.com/new](https://vercel.com/new) ← Import الـ repo.
2. الـ Framework بيتعرّف لحاله (Next.js).
3. **Environment Variables** (Production + Preview):
   | Key | Value |
   |-----|-------|
   | `RESEND_API_KEY` | `re_…` |
   | `CONTACT_TO_EMAIL` | إيميلك |
   | `CONTACT_FROM_EMAIL` | `Portfolio <contact@yourdomain.com>` |
   | `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` (**بدون** `/` بالآخر) |
   | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | من الخطوة 5 |
   | `NEXT_PUBLIC_BING_SITE_VERIFICATION` | من الخطوة 5 |
4. Deploy.

## 4. الـ Domain (**منصوح فيه بقوة للـ SEO**)
- **الأفضل:** domain فيه اسمك، متل `mohammadshaquqa.com` أو `shaquqa.dev`. لما حدا يبحث عن اسمك، الـ domain المطابق إشارة قوية.
- **خطوات:**
  1. اشتري الـ domain (Vercel Domains، Namecheap، Cloudflare...).
  2. Vercel ← Project ← Settings ← Domains ← ضيفه.
  3. خلّي نسخة وحدة هي الأساسية (مثلاً بدون `www`)، والتانية تعمل **redirect 308** عليها. Vercel بيعملها لحاله.
  4. عدّل الـ DNS عند المزوّد حسب تعليمات Vercel.
  5. حدّث `NEXT_PUBLIC_SITE_URL` واعمل Redeploy.
  6. **Resend:** اعمل verify لنفس الـ domain (SPF/DKIM) وغيّر `CONTACT_FROM_EMAIL`.
- **امنع أرشفة الـ `*.vercel.app`:** مشان ما يصير في نسختين من الموقع بـ Google. الـ canonical بيدل على الـ domain الأساسي (مرحلة 10)، وهاد كافي بالعادة.

## 5. تسجيل الموقع بمحركات البحث

### Google Search Console
1. [search.google.com/search-console](https://search.google.com/search-console) ← **Add property**.
2. اختار **URL prefix** (`https://yourdomain.com`) ← طريقة التحقق **HTML tag**.
3. انسخ قيمة الـ `content` بس ← حطها بـ `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` بـ Vercel ← Redeploy ← **Verify**.
   > (أو اختار **Domain property** مع تحقق عن طريق DNS TXT record، وهيك بتغطي كل الـ subdomains.)
4. **Sitemaps** ← ابعت `sitemap.xml`.
5. **URL Inspection** ← حط الرابط الرئيسي ← **Request indexing**. كرّرها لصفحات المشاريع.
6. بعد أسبوع لأسبوعين: شيك **Pages** (شو انأرشف) و**Performance** (شو الكلمات اللي عم يطلعلك فيها).

### Bing Webmaster Tools (بيغطي Bing وDuckDuckGo وYahoo)
1. [bing.com/webmasters](https://www.bing.com/webmasters) ← **Import from Google Search Console**، وهيك بتخلص بخطوة وحدة.
2. أو بشكل يدوي: تحقق بالـ meta tag (`NEXT_PUBLIC_BING_SITE_VERIFICATION`) وابعت الـ sitemap.

## 6. الربط من حساباتك لموقعك (Backlinks) ⭐
هاد هو **أهم شي** مشان Google يتأكد إنه الموقع إلك، ويطلع بالبحث عن اسمك مع حساباتك.

| المنصة | شو تعمل |
|-------|---------|
| **LinkedIn** | Edit profile ← **Contact info** ← Website ← ضيف رابط الموقع (نوع: Portfolio). وضيفه كمان بقسم **Featured** كـ Link. |
| **LinkedIn (Custom URL)** | خلّي رابط البروفايل `linkedin.com/in/mohammad-shaquqa` (بدون أرقام)، وحدّثه بـ `site.socials.linkedin`. |
| **GitHub** | Settings ← Profile ← **Website** ← رابط الموقع. |
| **GitHub Profile README** | اعمل repo باسم الـ username تبعك، وفيه `README.md` بيعرّف عنك مع رابط الموقع. |
| **GitHub repo تبع البورتفوليو** | حط رابط الموقع بـ **About ← Website** تبع الـ repo. |
| **حسابات تانية** | X، Stack Overflow، dev.to، Medium... أي حساب عندك ضيف فيه رابط الموقع، وضيفه لـ `site.socials.others`. |
| **الـ CV** | حط رابط الموقع بأول الـ CV (جنب الإيميل). |
| **توقيع الإيميل** | رابط الموقع. |

> **استعمل نفس الاسم بالضبط بكل مكان** ("Mohammad Shaquqa") ونفس الصورة الشخصية. هالشي بيساعد Google يربط الحسابات ببعض.

## 7. فحص ما بعد النشر
- [ ] كل الأقسام والروابط شغالة، وزر الـ CV بينزّل الملف.
- [ ] الـ 4 صفحات مشاريع بتفتح، و`/projects/xyz` ← 404.
- [ ] **الفورم:** ابعت رسالة حقيقية وتأكد إنها وصلت (وشوف الـ Spam).
- [ ] الـ OG preview على [opengraph.xyz](https://www.opengraph.xyz) و[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
- [ ] [Rich Results Test](https://search.google.com/test/rich-results) على الـ URL الحقيقي.
- [ ] Lighthouse على الـ URL الحقيقي (Mobile): SEO = 100.
- [ ] جرّب على موبايل حقيقي (iOS + Android) بالثيمين.

## 8. المتابعة (بعد النشر)
| الوقت | شو تشيك |
|------|---------|
| بعد 3 لـ 7 أيام | Search Console ← Pages: الصفحة الرئيسية انأرشفت؟ |
| بعد أسبوعين | ابحث بـ Google عن `"Mohammad Shaquqa"` و`site:yourdomain.com` |
| كل شهر | Search Console ← Performance: شو الكلمات والـ CTR |
| لما تضيف مشروع | حدّث `LAST_UPDATED` بالـ sitemap ← Request indexing للصفحة الجديدة |

> **توقعات واقعية:** الأرشفة بتاخد من أيام لأسابيع. الظهور أول نتيجة لاسمك بيصير أسرع إذا الـ domain باسمك وحساباتك كلها بتربط عليه.

## Definition of Done
- [ ] الموقع live على domain (أو `*.vercel.app`).
- [ ] جدول القسم 1 كامل، وما ضل ولا `TODO`.
- [ ] Search Console وBing: الموقع verified والـ sitemap مبعوت.
- [ ] LinkedIn وGitHub (وأي حساب تاني) فيهم رابط الموقع.
- [ ] الفورم بيبعت إيميلات من الـ production.
- [ ] كل push على `main` بيعمل deploy تلقائي، وكل PR إله Preview URL.
