# 01: تجهيز المشروع

## الهدف
مشروع Next.js فاضي شغّال، فيه كل الحزم ومكونات shadcn المطلوبة وهيكل المجلدات.

## الخطوات

### 1. تجهيز المجلد
`create-next-app` بيرفض يشتغل بمجلد فيه ملفات مش معروفة إله، ومجلد المشروع هلق فيه `Index (1).html` و`docs/`.
الحل: منعمل الـ scaffold بمجلد مؤقت، وبعدين منقل محتواه.

```bash
# من داخل Desktop
npx create-next-app@latest portfolio-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --turbopack --disable-git --yes
```
> `--disable-git`: مجلد `portfolio/` هو أصلاً git repo، فما بدنا `.git` تاني جوّا المجلد المؤقت.

بعدين:
1. انقل كل محتوى `portfolio-tmp/` (مع الملفات المخفية متل `.gitignore`، **بس بدون `.git`** إذا انعمل) لـ `portfolio/`.
2. احذف `portfolio-tmp/`.
3. انقل `Index (1).html` لـ `design/reference.html`.

> إذا سألك عن **React Compiler** اختار Yes (بيخفف الـ re-renders بدون `useMemo` يدوي).

### 2. تهيئة shadcn/ui

```bash
npx shadcn@latest init
```
- **Component library:** Radix
- **Base color:** Zinc
- **CSS variables:** Yes

بعدين ضيف المكونات:

```bash
npx shadcn@latest add button badge card sheet input textarea label field separator sonner
```

> `field` هو الطريقة الجديدة عند shadcn لبناء الفورمز مع react-hook-form (بدل `form` القديم). إذا ما لقيته بنسختك، استعمل `form`.

### 3. الحزم الإضافية

```bash
npm i motion next-themes lucide-react zod react-hook-form @hookform/resolvers resend
npm i -D prettier prettier-plugin-tailwindcss
```

### 4. Prettier
`.prettierrc`:
```json
{
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```
ضيف لـ `package.json`:
```json
"scripts": {
  "format": "prettier --write ."
}
```

### 5. Environment variables
`.env.example` (منرفعه على git):
```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```
انسخه لـ `.env.local` (هاد ما بينرفع، وتأكد إنه موجود بـ `.gitignore`).

### 6. هيكل المجلدات
أنشئ المجلدات الفاضية حسب [00-overview.md](00-overview.md):
```
src/components/{layout,sections,projects,contact,motion,shared,providers}
src/content  src/hooks  src/lib/validations  src/types
public/cv  public/projects
```

### 7. تنظيف
- احذف محتوى `src/app/page.tsx` الافتراضي، وخلّي `<main />` مؤقتاً.
- احذف الصور الافتراضية من `public/` (`next.svg` و`vercel.svg`...).
- `tsconfig.json`: تأكد إنه `"strict": true`.

### 8. Git
الـ repo موجود من قبل (فيه commit الخطة)، فبس منعمل commit جديد:
```bash
git status        # تأكد إنه ما في .env.local ولا node_modules بالقائمة
git add .
git commit -m "chore: scaffold Next.js + shadcn project"
```

## الملفات الناتجة
`package.json` و`tsconfig.json` و`components.json` و`src/app/*` و`src/components/ui/*` و`src/lib/utils.ts` و`.prettierrc` و`.env.example` و`design/reference.html`

## Definition of Done
- [ ] `npm run dev` بيفتح صفحة فاضية بدون أخطاء.
- [ ] `npm run build` و`npm run lint` بيخلصوا بنجاح.
- [ ] مكونات shadcn موجودة بـ `src/components/ui/`.
- [ ] `design/reference.html` موجود.
- [ ] انعمل commit الـ scaffold.
