# 10: SEO وAccessibility وPerformance

## الهدف
1. **لما حدا يبحث عن اسمك** (بالإنجليزي أو بالعربي)، يطلع موقعك **أول نتيجة**، ومعه LinkedIn وGitHub.
2. صفحات المشاريع تطلع لما حدا يبحث عن "React/Next.js developer" مع المدينة أو نوع المشروع.
3. المشاركة على LinkedIn وWhatsApp تطلع بصورة وعنوان مرتبين.
4. الموقع accessible بالكامل، و**Lighthouse ≥ 95** بكل الفئات (منهم SEO = 100).

## كيف Google بيعرف إنه هاد الموقع "إلك"؟
| الإشارة | وين بالخطة |
|---------|-----------|
| الاسم بالـ `<title>` وبالـ `<h1>` وبالـ description | القسم 1 هون + [05-hero-about.md](05-hero-about.md) |
| بيانات منظمة (`Person` + `ProfilePage`) فيها `sameAs` لحساباتك | القسم 5 |
| حساباتك (LinkedIn، GitHub...) بتربط **رجعة** على موقعك | [11-deploy.md](11-deploy.md) القسم 6 |
| Domain باسمك | [11-deploy.md](11-deploy.md) القسم 4 |
| الموقع مسجّل بـ Google Search Console والـ sitemap مبعوت | [11-deploy.md](11-deploy.md) القسم 5 |

> **الربط بالاتجاهين هو الأهم:** الموقع بيقول "هاد حسابي على LinkedIn" (`sameAs`)، وLinkedIn بيقول "هاد موقعي". هيك Google بيربطهم كـ "كيان" واحد، وممكن كمان يطلعلك Knowledge Panel مع الوقت.

## 1. Metadata: `src/app/layout.tsx`
- [x] منفّذ: [layout.tsx](../../src/app/layout.tsx) و[page.tsx](../../src/app/page.tsx) (الـ canonical والـ OG تبع الرئيسية) و[metadata.ts](../../src/lib/seo/metadata.ts) (الحقول المشتركة).

```ts
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.role}`,           // الاسم أول شي
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: site.name,
    title: `${site.name} | ${site.role}`,
    description: site.ogDescription,
    locale: "en_US",
    firstName: "Mohammad",
    lastName: "Shaquqa",
  },
  twitter: { card: "summary_large_image", title: `${site.name} | ${site.role}` },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // من Search Console
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};
```
- **الـ description** لازم يبلّش بالاسم، وطوله بين 140 و160 حرف.
- **صفحات المشاريع:** `generateMetadata` (مرحلة 07) بيعطي title متل `POS & Inventory Management System | Mohammad Shaquqa`، ووصف مختلف، و`canonical` خاص.
  > **انتبه:** الـ metadata بـ Next بتندمج **shallow**، يعني الـ `openGraph` تبع صفحة المشروع بيمسح الـ `openGraph` تبع الـ layout كله (`siteName` و`locale` و`type`...). لما تضيف هدول للـ layout، حط الحقول المشتركة بـ const (متل `sharedOpenGraph`) واعمله spread بـ `generateMetadata` بـ `app/projects/[slug]/page.tsx`، وحط `type: "article"` و`url: \`/projects/${slug}\``. نفس الشي لـ `twitter`.
  > وقبل ما ينحط `metadataBase` هون، الـ canonical تبع صفحات المشاريع بيطلع على `localhost`.
- ضيف `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` و`NEXT_PUBLIC_BING_SITE_VERIFICATION` لـ `.env.example`.
- **بالتنفيذ (بعد الـ code review):**
  - الـ `canonical: "/"` والـ `og:url` والـ `type: "profile"` انتقلوا لـ `app/page.tsx`. بالـ layout كانت كل صفحة ما بتعرّفهم (متل الـ 404) بتورثهم، وبتقول لـ Google إنها نسخة عن الرئيسية. والـ 404 صار عليها `robots: { index: false }` صريح.
  - `site.url` ما عاد بيرجع لـ `localhost` بالـ production: إذا لا `NEXT_PUBLIC_SITE_URL` ولا متغير Vercel موجودين، الـ build بيفشل برسالة واضحة.

## 2. Favicon: `src/app/icon.svg`
- [x] منفّذ: `icon.svg` و`favicon.ico` (48×48) و`apple-icon.png` (180×180) بـ `src/app/`.

انقل الـ favicon "MS" من التصميم (السطر 23) لملف SVG:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="7" fill="#4f46e5"/>
  <text x="16" y="21.5" font-family="system-ui,sans-serif" font-size="14" font-weight="700" fill="white" text-anchor="middle">MS</text>
</svg>
```
- احذف `favicon.ico` الافتراضي، وضيف **`app/apple-icon.png`** (180×180) و**`favicon.ico`** (48×48) بنفس الشكل. Google بيعرض الـ favicon جنب النتيجة بالموبايل، ولازم يكون مضاعفات الـ 48px.

## 3. OG Image
- [x] منفّذ: صورة للرئيسية وصورة لكل مشروع، والتصميم المشترك بـ [og-card.tsx](../../src/lib/seo/og-card.tsx).

### `src/app/opengraph-image.tsx` (عام)
```tsx
import { ImageResponse } from "next/og";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mohammad Shaquqa | Frontend Engineer";

export default function OG() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column",
                  justifyContent: "center", padding: 80, background: "#09090b", color: "#fff" }}>
      <div style={{ fontSize: 28, color: "#818cf8" }}>Frontend Engineer</div>
      <div style={{ fontSize: 72, fontWeight: 700, marginTop: 16 }}>Mohammad Shaquqa</div>
      <div style={{ fontSize: 30, color: "#a1a1aa", marginTop: 24 }}>React · Next.js · TypeScript</div>
    </div>,
    size,
  );
}
```
> إذا حطيت صورتك الشخصية بالـ OG (دائرة على اليمين)، بيصير الرابط أوضح لما ينشارك على LinkedIn.

### `src/app/projects/[slug]/opengraph-image.tsx`
نفس الفكرة، بس فيها عنوان المشروع + "by Mohammad Shaquqa" + الـ tech. استعمل `generateStaticParams` مشان تتولد static.
> **بالتنفيذ:** الـ alt صار لكل مشروع لحاله (فيه اسم المشروع) عن طريق `generateImageMetadata`. هيك الصورة ما بتنبنى وقت الـ build، بتتولّد أول مرة حدا بيطلبها وبعدين بتنحفظ. وما لازم `dynamicParams = false` بهالملف: كان بيطلّع 404 لكل الصور.

## 4. `src/app/sitemap.ts` و`src/app/robots.ts`
- [x] منفّذ: `/sitemap.xml` (الرئيسية + 4 مشاريع) و`/robots.txt`.

```ts
// sitemap.ts
// contentUpdatedAt بـ src/content/site.ts (نفس التاريخ بالـ JSON-LD). حدّثه يدوياً لما تغيّر المحتوى
const LAST_UPDATED = new Date(contentUpdatedAt);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: site.url, lastModified: LAST_UPDATED, changeFrequency: "monthly", priority: 1 },
    ...getAllProjects().map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}

// robots.ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
```
> **ليش مش `new Date()`؟** لأنه بيخلي كل build يقول لـ Google "كل شي تغيّر"، ومع الوقت Google بيتجاهل الـ `lastModified`.

## 5. Structured Data (JSON-LD)
- [x] منفّذ: [json-ld.ts](../../src/lib/seo/json-ld.ts) و[json-ld.tsx](../../src/components/shared/json-ld.tsx). الفحص بـ Rich Results Test بعد النشر (شوف الـ Definition of Done).


### `src/lib/seo/json-ld.ts`
```ts
import { site } from "@/content/site";
import type { Project } from "@/types/content";

const personId = `${site.url}/#person`;

export function personJsonLd() {
  return {
    "@type": "Person",
    "@id": personId,
    name: site.name,
    alternateName: site.alternateNames,
    givenName: "Mohammad",
    familyName: "Shaquqa",
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    image: site.profileImage ? `${site.url}${site.profileImage}` : undefined,
    email: site.email ? `mailto:${site.email}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: "Latakia", addressCountry: "SY" },
    alumniOf: { "@type": "CollegeOrUniversity", name: university.org }, // من @/content/experience
    // قائمة منقّاية بقصد: تقنيات بيعرفها Google، مش كل نصوص قسم Skills
    knowsAbout: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand", "Redux Toolkit", "TanStack Query"],
    sameAs: [
      site.socials.linkedin,
      site.socials.github,
      ...(site.socials.others ?? []).map((s) => s.url),
    ].filter((u): u is string => !!u && /^https?:\/\//.test(u)), // لا null (لسا ما وصل) ولا رابط ناقص
    // بالتنفيذ: إذا طلعت القائمة فاضية منحط undefined بدل []
  };
}

export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      {
        "@type": "ProfilePage",
        "@id": `${site.url}/#profilepage`,
        url: site.url,
        name: `${site.name} | ${site.role}`,
        mainEntity: { "@id": personId },
        dateModified: contentUpdatedAt,
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        alternateName: site.alternateNames,
        publisher: { "@id": personId },
      },
    ],
  };
}

export function projectJsonLd(project: Project) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        url: `${site.url}/projects/${project.slug}`,
        image: project.image ? `${site.url}${project.image.src}` : undefined,
        creator: { "@id": personId },
        keywords: project.stack.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Projects", item: `${site.url}/#projects` },
          { "@type": "ListItem", position: 3, name: project.title },
        ],
      },
    ],
  };
}
```

### `src/components/shared/json-ld.tsx`
```tsx
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
```
- `<JsonLd data={homeJsonLd()} />` بـ `app/page.tsx`.
- `<JsonLd data={projectJsonLd(project)} />` بـ `app/projects/[slug]/page.tsx`.
> **بالتنفيذ:** الـ `personJsonLd()` كامل موجود كمان بالـ `@graph` تبع صفحة المشروع، لأن Google ما بيربط `@id` بين صفحات مختلفة، وبدونه الـ `creator` بيطلع فاضي. وروابط الصور بتنبنى بـ `new URL(src, site.url)` مش بدمج النصوص.
> الـ `replace(/</g, …)` بيمنع أي `</script>` بالنص إنه يكسر الصفحة.

## 6. SEO بالمحتوى نفسه (On-page)
- [x] **h1** فيه الاسم (شوف [05-hero-about.md](05-hero-about.md)).
- [x] **h1 واحد بكل صفحة**، وبصفحة المشروع الـ h1 هو اسم المشروع.
- [x] **الـ About** بيذكر الاسم الكامل والدور والمدينة بجملة طبيعية مرة وحدة على الأقل. (أول جملة: "I'm Mohammad Shaquqa, a frontend engineer based in Latakia, Syria.")
- [x] **الـ Footer** فيه الاسم الكامل (موجود: `© 2026 Mohammad Shaquqa`).
- [x] **الـ alt text** للصورة الشخصية: `"Mohammad Shaquqa, Frontend Engineer"`.
- [ ] **الـ alt text** لصور المشاريع وصفي (مش "screenshot"). ⏳ مستني الصور (`image: null` بـ `src/content/projects.ts`)، وهلق الـ placeholders إلها `aria-label` وصفي.
- [x] **الروابط الداخلية:** الكروت بتربط لصفحات المشاريع، وصفحات المشاريع بتربط لبعضها (Prev/Next) وللرئيسية.
- [x] **الـ URLs** قصيرة وواضحة (`/projects/pos-inventory`).
- [x] **ما في محتوى مخفي عن Google:** الحركات ما بتخبّي النص عن الـ SSR (مرحلة 09).
- [ ] **ملف الـ CV:** اسمه فيه اسمك (`Mohammad-Shaquqa-CV.pdf`)، وخصائص الـ PDF (Title/Author) فيها اسمك. Google بيأرشف ملفات PDF كمان. ⏳ الرابط جاهز (`/cv/Mohammad-Shaquqa-CV.pdf`) بس الملف لسا مش بـ `public/cv/`.

## 7. Accessibility checklist
- [x] Skip link هو أول عنصر بيجي بالـ Tab.
- [x] العناوين متسلسلة (h1 ← h2 ← h3) بدون قفزات.
- [x] كل `<section>` إله `aria-labelledby`. (منهم أقسام صفحة المشروع)
- [x] كل الأيقونات الزخرفية عليها `aria-hidden`، والأزرار اللي فيها أيقونة بس إلها `sr-only` أو `aria-label`.
- [x] الروابط الخارجية فيها "(opens in a new tab)" كـ `sr-only`. (انضافت للـ Footer)
- [x] `focus-visible` ring واضح على **كل** عنصر تفاعلي بالثيمين.
- [x] الـ contrast ≥ 4.5:1 للنص العادي بالثيمين (افحص `text-subtle` = zinc-500 بالذات).
  > zinc-500 كان بيفشل: 4.1:1 عالخلفية بالـ dark، و4.4:1 على `bg-muted` بالـ light. صار `--subtle` = `#6b6b74` (light) و`#84848d` (dark)، يعني ≥ 4.8:1 على كل الخلفيات.
- [x] الفورم: labels مربوطة، و`aria-invalid`، و`aria-describedby` للأخطاء، و`aria-live` للـ status.
- [x] كل شي بيشتغل بالكيبورد بس (Tab، Enter، Escape).
- [x] `lang="en"` على `<html>`.
- [x] افحص بـ **axe DevTools**: ولا خطأ.
  > انفحص بـ axe-core (نفس محرّك الـ extension) عبر Playwright: الرئيسية وصفحة مشروع و404، بالثيمين، على 375px و1280px ← 0 violations.

## 8. Performance checklist (كمان بيأثر على الترتيب بـ Google عن طريق Core Web Vitals)
- [ ] **الصور:** كلها `next/image` مع `sizes` صح، والـ screenshots بصيغة `.webp` (1280×800، أقل من 150KB)، والصورة الشخصية 640×640. ⏳ الكود جاهز (`next/image` + `sizes`)، بس الصور لسا ما وصلت.
- [x] **الـ LCP < 2.5s:** صورة البروفايل مع `priority`، وما في حركة بتخبّي الـ h1.
  > الـ LCP هو الـ h1. بـ Lighthouse مع throttling حقيقي (`devtools`) بيطلع 1.9 لـ 2.2s. بالـ throttling الافتراضي (simulated) على localhost بيطلع ~3s، لأنه أول رسم بيصير بعد ما الـ JS كله يتنفّذ، فالمحاكاة بتحسب كل الـ JS عالـ LCP. (بـ Next 16 الـ `priority` صار `preload`، والصورة مش الـ LCP فعليها `loading="eager"`، شوف `hero.tsx`.)
- [x] **الـ CLS = 0:** كل الصور والـ placeholders مساحتها محجوزة.
- [x] **الـ INP < 200ms:** الـ client JS بأقل حجم ممكن.
  > الـ schema تبع الفورم صار بـ `zod/mini` بدل `zod` (من 105KB لـ 31KB gzip)، و**Motion انشالت كلياً** (شوف [09-animations.md](09-animations.md) القسم 7)، وsonner (~23KB) صار يتحمّل بس لما ينبعت الفورم (`lazy-toaster.tsx`). الـ TBT بالرئيسية نزل من ~230–330ms لـ ~90–200ms (الـ INP الحقيقي بينقاس بعد النشر من Search Console ← Core Web Vitals).
- [x] **الخطوط:** system fonts، أو `next/font` إذا اخترت Geist.
- [x] **الـ Bundle:** افحص الـ output تبع `npm run build` (First Load JS للصفحة الرئيسية).
  > الرئيسية بتنزّل ~207KB JS (gzip). كانت ~322KB: `zod/mini` ← ~248KB، شيل Motion ← ~216KB، sonner lazy ← ~207KB. جرّبنا `experimental.inlineCss` وما حسّن الـ FCP، وكبّر الـ HTML من 20KB لـ 58KB، فرجّعناه.
- [x] ~~**Lighthouse** (Mobile، بـ Incognito، على `npm run build && npm run start`): ≥ 95 بالأربع فئات، والـ SEO = 100.~~ ➡️ **انتقل للمرحلة 11** ([11-deploy.md](11-deploy.md) القسم 7)
  > آخر فحص على localhost (6 مرات، 2026-09-26): Accessibility وBest Practices وSEO = **100** بكل الصفحات. Performance: صفحات المشاريع 96 لـ 98، والرئيسية 92 لـ 96 (**الوسيط 94**، يعني عالحد). الـ LCP المحسوب على localhost (~2.8s) مش دقيق (الفعلي ~0.3s)، فالحكم النهائي بيكون على رابط Vercel بـ PageSpeed Insights.

## Definition of Done
- [x] `/sitemap.xml` و`/robots.txt` و`/opengraph-image` بيشتغلوا.
- [x] ~~[Rich Results Test](https://search.google.com/test/rich-results) بيقرأ `Person` و`ProfilePage` بدون أخطاء، و`BreadcrumbList` بصفحات المشاريع.~~ ➡️ **انتقل للمرحلة 11** ([11-deploy.md](11-deploy.md) القسم 7): بدها رابط حقيقي. الـ JSON-LD جاهز وموجود بالـ HTML.
- [x] ~~[Schema Markup Validator](https://validator.schema.org) بدون أخطاء.~~ ➡️ **انتقل للمرحلة 11** ([11-deploy.md](11-deploy.md) القسم 7).
- [x] `view-source:` للرئيسية: الـ title والـ description والـ canonical والـ OG والـ JSON-LD كلهم موجودين بالـ HTML (مش بس بعد الـ JS).
- [x] Lighthouse SEO = 100.
- [ ] كل الـ checklists فوق خالصة. ⏳ باقي بس اللي مستني منك: صور المشاريع (webp + alt) وملف الـ CV.
- [x] الخطوات اللي بتنعمل برّا الموقع (Search Console والروابط الراجعة) موجودة بـ [11-deploy.md](11-deploy.md).
