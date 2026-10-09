# 10: مرحلة Contact (الروابط، الفورم، الـ credits)

## الهدف
آخر مرحلة: نافذة الروابط (إيميل، LinkedIn، GitHub، الموقع، زر الـ CV)، فورم بشكل pixel **بيبعت إيميل حقيقي**، ونافذة "Thanks for playing".

## الفكرة
- **منطق الفورم من v1، مش من المرجع.** المرجع بيفتح `mailto:` (أو بيبعت لـ endpoint خارجي). عنا من v1 شي أحسن وشغّال: `react-hook-form` + `zod/mini` + Server Action + Resend + honeypot + rate limit. هدول **ما بيتغيّروا**: `src/app/actions/contact.ts` و`src/lib/validations/contact.ts` متل ما هم.
- **الشكل من المرجع:** حقول native (`<input>`، `<textarea>`) بدل مكوّنات shadcn، فما في داعي لـ `Controller`: `register()` بيكفي.
- **اللعبة فوق المنطق:** صوت الخطأ لما الحقول غلط، وصوت النجاح مع confetti من زر الإرسال لما الرسالة تنبعت.
- الروابط اللي لسا `null` (الإيميل، LinkedIn، GitHub) ما بتنعرض، متل v1.

## جدول الربط

| من المرجع (الأسطر) | لوين |
|--------------------|------|
| 1186–1226 CSS الـ CONTACT والـ credits | `src/styles/pixel/contact.css` |
| 1773–1855 HTML مرحلة Contact | `src/components/stages/contact.tsx` |
| 1817–1841 HTML الفورم | `src/components/contact/contact-form.tsx` |
| 2524–2594 JS الفورم | **ما بينتقل.** المنطق من `git show main:src/components/contact/contact-form.tsx` |

## الخطوات

### 1. `src/styles/pixel/contact.css` ← 1186–1226
متل ما هو، مع تعديلين:

| السطر | المرجع | بيصير | السبب |
|-------|--------|-------|-------|
| 1222 | `.credits h2 { … }` | `.credits h3 { … }` | مستوى العنوان نزل درجة |
| 1225 | `.credit-links a { color: #fff; text-decoration-thickness: 2px; text-underline-offset: 4px; }` | ضيف جوّاها `text-decoration-line: underline;` | الـ preflight تبع Tailwind بيشيل الـ underline الافتراضي عن الروابط |

### 2. `src/components/contact/contact-form.tsx`
```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";

import { sendContact } from "@/app/actions/contact";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { labels } from "@/content/labels";
import { confetti } from "@/game/effects";
import { play } from "@/game/sound";
import { cn } from "@/lib/utils";
import { CONTACT_INVALID_MSG, contactSchema, type ContactInput } from "@/lib/validations/contact";

/** pending بلون محايد (لسا ما نجح شي)، ok أخضر، bad أحمر */
type Status = { tone: "pending" | "ok" | "bad"; msg: string } | null;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched", // متل المرجع: validate عند الـ blur، وبعدها مع كل input
    defaultValues: { name: "", email: "", message: "", company: "" },
    shouldFocusError: true, // focus على أول حقل غلط
  });
  const [status, setStatus] = useState<Status>(null);

  async function onSubmit(values: ContactInput, event?: BaseSyntheticEvent) {
    // زر الإرسال من الـ event مش من ref: الـ lint بيمنع ref جوّا function بتتمرّق لـ handleSubmit وقت الـ render
    const form = event?.target instanceof HTMLFormElement ? event.target : null;
    const submit = form?.querySelector('button[type="submit"]');

    setStatus({ tone: "pending", msg: "Sending…" });
    try {
      const res = await sendContact(values);
      if (res.ok) {
        reset();
        setStatus({ tone: "ok", msg: "Message sent! I’ll reply within one business day." });
        play("success");
        const rect = submit?.getBoundingClientRect();
        if (rect) confetti(rect.left + rect.width / 2, rect.top, 40);
        return;
      }
      // رجّع أخطاء السيرفر للحقول، والـ focus على أول واحد غلط
      const fieldErrors = Object.entries(res.fieldErrors ?? {}) as [
        keyof ContactInput,
        string[] | undefined,
      ][];
      fieldErrors.forEach(([name, messages], i) =>
        setError(name, { message: messages?.[0] }, { shouldFocus: i === 0 }),
      );
      setStatus({ tone: "bad", msg: res.error });
      play("error");
    } catch (err) {
      // انقطع النت، أو deploy جديد غيّر الـ action ID ("Failed to find Server Action")
      console.error("[contact]", err);
      setStatus({
        tone: "bad",
        msg: "The message didn’t send. Check your connection, refresh the page, and try again.",
      });
      play("error");
    }
  }

  function onInvalid() {
    setStatus({ tone: "bad", msg: CONTACT_INVALID_MSG });
    play("error");
  }

  return (
    <form
      className="win form"
      noValidate
      aria-labelledby="form-title"
      aria-describedby="form-note"
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      // أي تعديل بعد النتيجة بيمسحها: خطأ قديم أو "Message sent" ما عاد إلهم علاقة بالنص الجديد
      onChange={() => {
        if (status && !isSubmitting) setStatus(null);
      }}
    >
      <h3 id="form-title" className="win-title">
        {labels.contact.form}
      </h3>

      <div className="form-row">
        <div className="field">
          <label htmlFor="cf-name">Name</label>
          <input
            id="cf-name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby="cf-name-error"
            {...register("name")}
          />
          {/* الـ <p> دايماً موجود ومساحته محجوزة (min-height بالـ CSS): ظهور الخطأ ما بيحرّك الـ layout */}
          <p id="cf-name-error" className="field-error">
            {errors.name?.message}
          </p>
        </div>
        <div className="field">
          <label htmlFor="cf-email">Email</label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            placeholder="jane@company.com"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby="cf-email-error"
            {...register("email")}
          />
          <p id="cf-email-error" className="field-error">
            {errors.email?.message}
          </p>
        </div>
      </div>

      <div className="field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          rows={5}
          placeholder="Role, team, and a little about what you're building"
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby="cf-message-error"
          {...register("message")}
        />
        <p id="cf-message-error" className="field-error">
          {errors.message?.message}
        </p>
      </div>

      {/* Honeypot: مخفي عن البشر وعن قارئ الشاشة، وما بياخد focus بالـ Tab. البوت بيعبّيه، والـ action بيتجاهل الرسالة */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
        {...register("company")}
      />

      <div className="form-foot">
        <p id="form-note" className="form-note">
          All fields are required.
        </p>
        <button type="submit" className={btn()} disabled={isSubmitting}>
          <PixelIcon name="mail" />
          Send message
        </button>
      </div>

      <p
        className={cn("form-status", status?.tone === "ok" && "ok", status?.tone === "bad" && "bad")}
        role="status"
        aria-live="polite"
      >
        {status?.msg}
      </p>
    </form>
  );
}
```

**شو تغيّر عن فورم v1:**

| v1 | هون |
|----|-----|
| `Controller` + `Field` / `Input` / `Textarea` (shadcn) | `register()` على عناصر native بـ classes المرجع |
| toast من `sonner` + ✓ بتنرسم | صوت `success` + confetti، ونص الـ status بالأخضر |
| ما في صوت | `error` لما الحقول غلط أو الإرسال يفشل |
| `aria-invalid` بيلوّن الـ border | نفس الـ attribute، والـ CSS بيبدّل الإطار للأحمر (`--frame-field-bad`) |

**اللي ما تغيّر:** الـ schema، رسائل الأخطاء، الـ honeypot، الـ rate limit، والـ Server Action كله.

### 3. `src/components/stages/contact.tsx`
```tsx
import { ContactForm } from "@/components/contact/contact-form";
import { btn } from "@/components/pixel/btn";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { NewTabHint } from "@/components/shared/new-tab-hint";
import { Stage } from "@/components/stages/stage";
import { labels } from "@/content/labels";
import { site } from "@/content/site";
import type { PixelIconName } from "@/pixel/sprites/icons";

/** "https://www.linkedin.com/in/jane/" ← "linkedin.com/in/jane" */
function displayUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/+$/, "");
}

export function ContactStage() {
  const { email, socials, location, cvPath } = site;
  // LinkedIn وGitHub وأي حساب تاني. اللي لسا null (ما وصل) ما بينعرض
  const accounts = [
    { label: labels.contact.linkedin, url: socials.linkedin },
    { label: labels.contact.github, url: socials.github },
    ...(socials.others ?? []),
  ].filter((account): account is { label: string; url: string } => account.url !== null);

  return (
    <Stage id="contact">
      <div className="contact-grid">
        <div className="win">
          <h3 className="win-title">{labels.contact.links}</h3>
          <ul className="links">
            {email && (
              <li>
                <LinkRow icon="mail" label={labels.contact.email} text={email} href={`mailto:${email}`} />
              </li>
            )}
            {socials.linkedin && (
              <li>
                <LinkRow
                  icon="profile"
                  label={labels.contact.linkedin}
                  text={displayUrl(socials.linkedin)}
                  href={socials.linkedin}
                  external
                />
              </li>
            )}
            {socials.github && (
              <li>
                <LinkRow
                  icon="branch"
                  label={labels.contact.github}
                  text={displayUrl(socials.github)}
                  href={socials.github}
                  external
                />
              </li>
            )}
            <li>
              <LinkRow icon="pin" label={labels.contact.location} text={location} />
            </li>
          </ul>
          <a className={btn()} href={cvPath} download>
            <PixelIcon name="download" />
            {labels.contact.cv}
          </a>
        </div>

        <ContactForm />
      </div>

      <div className="win credits">
        <h3>{labels.contact.credits}</h3>
        <p>
          &copy; {new Date().getFullYear()} {site.name}. {site.footer.credit}
        </p>
        <ul className="credit-links">
          <li>
            <a href="#home">{labels.contact.backToTitle}</a>
          </li>
          <li>
            <a href={cvPath} download>
              {labels.contact.cvShort}
            </a>
          </li>
          {accounts.map((account) => (
            <li key={account.url}>
              <a href={account.url} target="_blank" rel="noopener noreferrer">
                {account.label}
                <NewTabHint />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Stage>
  );
}

type LinkRowProps = {
  icon: PixelIconName;
  label: string;
  text: string;
  /** بدون href السطر نص بس (الموقع) */
  href?: string;
  external?: boolean;
};

function LinkRow({ icon, label, text, href, external }: LinkRowProps) {
  const content = (
    <>
      <span className="link-ico" aria-hidden="true">
        <PixelIcon name={icon} />
      </span>
      <span className="link-text">
        <b>{label}</b>
        <span>{text}</span>
      </span>
    </>
  );

  if (!href) return <div className="link-row">{content}</div>;

  return (
    <a
      className="link-row"
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {content}
      {external && <NewTabHint />}
    </a>
  );
}
```

### 4. `src/app/page.tsx` (النسخة النهائية)
```tsx
import type { Metadata } from "next";

import { ProjectDialogs } from "@/components/projects/project-dialog";
import { JsonLd } from "@/components/shared/json-ld";
import { AboutStage } from "@/components/stages/about";
import { ContactStage } from "@/components/stages/contact";
import { ExperienceStage } from "@/components/stages/experience";
import { ProjectsStage } from "@/components/stages/projects";
import { SkillsStage } from "@/components/stages/skills";
import { TitleScreen } from "@/components/stages/title-screen";
import { site } from "@/content/site";
import { homeJsonLd } from "@/lib/seo/json-ld";
import { defaultTitle, sharedOpenGraph } from "@/lib/seo/metadata";

// الـ title والـ description والـ twitter من الـ layout. الـ openGraph كامل هون لأن الدمج shallow
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    ...sharedOpenGraph,
    type: "profile",
    url: "/",
    title: defaultTitle,
    description: site.ogDescription,
    firstName: "Mohammad",
    lastName: "Shaquqa",
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <TitleScreen />
      <AboutStage />
      <SkillsStage />
      <ExperienceStage />
      <ProjectsStage />
      <ContactStage />
      {/* برّا المراحل بقصد: <dialog> مفتوح جوّا مرحلة مخفية بيقفل الصفحة (المرحلة 09) */}
      <ProjectDialogs />
    </>
  );
}
```

## الإعداد للتجربة
الفورم بيحتاج `.env.local` (موجود من v1): `RESEND_API_KEY` و`CONTACT_TO_EMAIL` و`CONTACT_FROM_EMAIL`. بدونهم الـ action بيرجّع "The message didn't send…" وبيكتب السبب بالـ terminal.

## الملفات
`src/styles/pixel/contact.css`، `src/components/contact/contact-form.tsx`، `src/components/stages/contact.tsx`، `src/app/page.tsx`

## Definition of Done
**الشكل (قارن مع المرجع):**
- [x] `/#contact`: صندوق البريد بالعالم. نافذة الروابط عاليسار والفورم عاليمين (أعرض)، وتحتهم نافذة الـ credits. من 1023px ونازل: عمود واحد.
- [x] مع المحتوى الحالي: سطر "Location" بس (الإيميل وLinkedIn وGitHub لسا `null`) وزر الـ CV. جرّب مؤقتاً قيمة لـ `site.email` ← بيطلع سطر الإيميل بأيقونة teal، وبالـ hover إطاره دهبي. رجّعها.
- [x] الحقول: خلفية غامقة، إطار أبيض بزوايا مقصوصة، وبالـ focus بيصير دهبي. المؤشر دهبي.
- [x] Name وEmail جنب بعض، وتحت 720px تحت بعض.
- [x] الـ credits: "Thanks for playing" بالدهبي، والروابط تحتها **عليها underline**.

**الـ validation:**
- [x] إرسال والفورم فاضي: الحقول التلاتة إطارها أحمر، رسالة تحت كل حقل، الـ status "Check the highlighted fields and try again." بالأحمر، والـ focus على Name.
- [x] كتابة حرف واحد بـ Name ← الرسالة بتضل. كتابة حرفين ← بتختفي والإطار بيرجع.
- [x] إيميل غلط ← "Enter a valid email address, like name@company.com."
- [ ] ظهور الأخطاء واختفاؤها ما بيحرّك باقي الفورم (المساحة محجوزة).
  - **ما تحقق، وبيضل هيك (صاحب الموقع، 2026-10-09):** راجع الفورم وقال إنو تمام متل ما هو، يعني متل المرجع. رسالة الإيميل (ورسالة الاسم) بتلف لسطرين، والـ `min-height: 1.5em` بيحجز سطر واحد، فالفورم بيطول 25px من 768px وطالع و101px على 375px، بالمرجع وبالنسخة بالضبط.
- [x] مع الصوت مفعّل: صوت الخطأ عند كل إرسال فاشل.

**الإرسال:**
- [x] رسالة صحيحة ← "Sending…" والزر disabled ← "Message sent! I'll reply within one business day." بالأخضر، الفورم بيفضى، confetti من عند الزر، وصوت النجاح.
- [x] **الإيميل وصل فعلاً** على `CONTACT_TO_EMAIL`، والـ Reply-To هو إيميل المرسل.
  - صاحب الموقع أكّد بـ 2026-10-09 إنو رسائل التجربة الـ 3 وصلت. الـ Reply-To بيحطه الـ action (`replyTo: email`) وResend قبله، بس ما انشاف بالصندوق نفسه: كبسة Reply على وحدة من الرسائل لازم تطلّع `phase10-test@example.com`.
- [x] 4 رسائل ورا بعض ← الرابعة: "Too many messages in a short time…".
- [x] أي كتابة بعد النتيجة بتمسح رسالة الـ status.

**Accessibility:**
- [x] كل حقل مربوط بالـ label تبعه وبرسالة خطؤه (`aria-describedby`)، و`aria-invalid` بيتبدّل.
- [ ] الـ status `role="status"`: قارئ الشاشة بيقرأ النتيجة بدون ما يتحرك الـ focus.
  - **تحقق جزئياً، وبيضل هيك (صاحب الموقع، 2026-10-09):** طلب إنو الزر يضل `disabled` وقت الإرسال. الـ status `role="status"` و`aria-live="polite"` والـ focus ما بيروح عليه، بس المتصفح بيشيل الـ focus عن الزر لما يتعطّل، فبيروح على `<body>` (المرجع وv1 نفس الشي). الـ Tab اللي بعدها بـ Chrome بيروح على "Back to title". ما انجرّب بقارئ شاشة حقيقي.
- [x] الأسهم يمين/يسار جوّا الحقول بتحرّك المؤشر، **مش** المرحلة.
- [x] "Back to title" بيرجّع لشاشة البداية مع الانتقال.

**عام:**
- [x] `prefers-reduced-motion`: ما في confetti، والباقي متل ما هو.
- [x] `npm run lint && npm run build && npm run sprites:check` ناجحين.

## ملاحظات التنفيذ
- **الكود متل الخطة، مع تعديل واحد:** نص الـ credits بـ `contact.tsx` صار template string واحد (`` {`© ${…} ${site.name}. ${site.footer.credit}`} ``) بدل `&copy; {…} {site.name}. {…}`، لأن الأخير بيطلع 6 قطع نص وبيكسر الـ kerning بخط Pixelify (قاعدة بالـ Gotchas بـ `CLAUDE.md`). الـ format بس عاد لف سطر الـ `cn(…)` بالفورم.
- **الخطوط صارت نفس ملفات المرجع (بطلب صاحب الموقع وقت المرحلة).** هاد البند اللي كان مفتوح من المرحلة 05:
  - `next/font/google` بيطلب الخطوط من Google كأنه Chrome عـ Mac (الـ User-Agent بـ `node_modules/next/dist/compiled/@next/font/dist/google/fetch-resource.js`)، فكان ياخد نسخة بدون hinting. الـ 8 ملفات اللي كانت بالـ build طلعت مطابقة بالبايت لنسخة الـ Mac. نسخة Windows (اللي بيحمّلها المرجع عنا) فيها نفس الحروف والمقاسات والـ outlines والـ kerning بالضبط (انقارنت بـ fontTools)، والفرق جداول الـ hinting بس: `fpgm` و`prep` و`cvt` بـ Press Start 2P (12,512 byte بدل 4,704)، و`prep` بـ Pixelify Sans.
  - صار: ملفين الـ latin تبع Windows بـ `src/assets/fonts/`، نفس البايتات اللي بينزّلها المرجع من fonts.gstatic.com. معرّفين بـ `next/font/local` بـ `src/lib/fonts.ts`، والـ layout بيعمل import للملف. الـ @font-face فيه اسم العائلة والأوزان متل المرجع، وبدون fallback مقيوس (`adjustFontFallback: false`). `tokens.css` صار يسمّي العائلتين بالاسم متل المرجع بالحرف (`"Press Start 2P", ui-monospace, …`)، فالـ `font-family` المحسوب صار نفسه (قبل كان فيه `"Press Start 2P Fallback"` زيادة). الـ preload لسا موجود.
  - Pixelify Sans: المرجع بيطلب 400 و500 و600، وGoogle بيعطي نفس الملف للتلاتة. المدى صار `400 600` بدل `400 700`: نفس الرسم لكل وزن بالتصميم، وأي وزن أتقل (متل bold) بيوقف عند 600 متل المرجع.
  - الـ latin بس: المرجع بيعرّف كمان latin-ext وcyrillic وgreek، وولا حرف منهم بنص الموقع. انفحص بالـ DevTools Protocol (`CSS.getPlatformFontsForNode`) على المراحل الست بالصفحتين: كل النص بيترسم بالخطين، وولا glyph من خط النظام. حرف من برّا الـ latin بياخد الخط اللي بعده بالـ tokens.
  - تلات مشاكل بـ Turbopack (Next 16.3.6) مع `next/font/local`، مكتوبين بـ `src/lib/fonts.ts` وبالـ Gotchas: (1) `variable` و`className` بياخدوا اسم المتغير بالـ JS (`"pressStart"`) مش العائلة اللي بالـ `declarations`، فما منستعملهم؛ (2) قيمة الـ declaration بتنحط بـ JSON بدون escape، فـ `"` جوّاها بتكسر الـ build، والحل تنصيص مفرد؛ (3) بدون تنصيص، `Press Start 2P` (كلمة بتبلّش برقم) بيخرّب الـ @font-face والمتصفح بيتجاهله بصمت (النص كان ينرسم بـ Consolas). وكمان القيم لازم تكون literal: ما بيقبل const.
  - صفحة الـ 404 ما فيها preload للخطوط، ونفس الشي كان مع `next/font/google` (انعمل build للنسخة القديمة وانفحص). الخطوط بتنزل من الـ CSS عادي.
  - على macOS وiOS الـ hinting ما إله أثر، فالرسم ما تغيّر. على Windows صار متل المرجع.
- **المقارنة مع المرجع، والمرجع عم ياخد خطوطه من Google** (بدون تبديل الخطوط اللي كان ينعمل بالمراحل السابقة):
  - مرحلة Contact، 39 حالة: العروض الستة نهار وليل، وحواف الـ breakpoints (379/380، 479/480، 719/720، 859/860، 1023، 1239/1240، 1399/1400، 1599/1600)، وبعد إرسال فاضي (الأخطاء) على 8 عروض، والحقول معبّاية، ورسالة النجاح. سطور الروابط والـ credits تبع النسخة انحطّت جوّا المرجع (روابطه وهمية)، ونص سطر المرحلة والـ © انحط من النسخة. **النتيجة:** ولا فرق بالـ styles ولا بالبنية، وولا بكسل.
  - المراحل السابقة بنفس الطريقة، 65 حالة (Title وAbout وSkills وExperience وProjects، والمودال المفتوح على العروض الستة): ولا فرق بالـ styles ولا بالبنية، والبكسلات مطابقة إلا 14 بكسل بحالة وحدة (Projects على 1680 بالليل) جوّا مربع 12×11، وبجلسة جديدة صارت 0. يعني الخط صار متل المرجع بكل الصفحة.
  - **التجربة المؤقتة:** `site.email` وLinkedIn وGitHub انحطّوا بقيم المرجع الوهمية (build مؤقت، ورجع `site.ts` بعدها متل ما كان بالحرف). الأسطر الأربعة صارت متل المرجع بدون أي نقل: 15 حالة، ولا فرق بالـ styles. الفرق الوحيد بالبنية `(opens in a new tab)` (sr-only) جوّا رابطي LinkedIn وGitHub بالـ credits، وهو مقصود (`NewTabHint` من v1). سطر الإيميل أيقونته teal، وبالـ hover إطاره دهبي (`--frame-slot-on`)، والـ JSON-LD أخد الروابط بـ `sameAs`.
  - ظاهرتين بالفحص، مش فروقات: (1) بحالة hover على 375 المرجع خسر الـ hover، لأن السكربت حط نص سطر المرحلة (أطول بالنسخة) بعد الـ hover، فالسطر نزل 52px من تحت الماوس. لما انحط النص قبل الـ hover: 0 بكسل. (2) حالة 1280 بالليل انعادت 3 مرات: مرة فيها 41,112 بكسل مختلف بكل النص وحواف الغيوم (أقصى فرق 6 من 255) ومرتين 0. اللقطة بالصفحتين بتتبادل بين رسمتين، فأحياناً لقطة المرجع ولقطة النسخة بيطلعوا من رسمتين مختلفتين.
- **فحص السلوك** (36 فحص على الـ production build): الـ labels والـ `aria-describedby` والـ honeypot (مخفي، `tabIndex -1`، `aria-hidden`)؛ الإرسال الفاضي (الإطارات الحمرا، الرسائل، الـ status بالأحمر، الـ focus على Name، صوت الخطأ 170Hz)؛ تصليح الحقول واحد واحد؛ الأسهم جوّا Name وMessage بتحرّك المؤشر وبرّاهم بتبدّل المرحلة؛ النجاح (عبر الـ honeypot، وشوف التصحيح ببند "غلطة بالفحص" تحت): "Sending…" والزر disabled، بعدها الرسالة بالأخضر، الفورم فضي، 40 قطعة confetti من نص الزر من فوق، صوت النجاح (784 و988 و1175 و1568Hz)، وأول حرف بعدها بيمسح الـ status. مع reduced motion نفس الشي بدون confetti. "Back to title" بيرجع لشاشة البداية بعد الـ wipe والـ focus على الاسم. ترتيب الـ Tab: CV، Name، Email، Message، Send message، Back to title، CV (PDF).
- **الإرسال الحقيقي:** 3 رسائل (الـ subject "Portfolio enquiry from Phase 10 test 1" و2 و3، الـ Reply-To `phase10-test@example.com`) نجحوا، ومع كل وحدة confetti وصوت النجاح. الرابعة ورا بعض رجّعت "Too many messages in a short time. Please try again in a few minutes." بالأحمر مع صوت الخطأ. سجل السيرفر بدون ولا خطأ `[contact]`. صاحب الموقع أكّد وصول التلاتة لصندوقه. الـ rate limit بيعدّ حسب `x-forwarded-for`، و`next start` بيحطه من الـ socket إذا ما كان موجود.
- **غلطة بالفحص: إيميلات تجربة زيادة (انكشفت وتصلّحت بـ 2026-10-09).** فحوصات النجاح كانت مكتوبة على أساس إنها بتمرق من الـ honeypot وما بتبعت شي، بس السكربت كان يعبّي الحقل بـ `hp.value = …` وبعدها حدث `input`، وReact بيتجاهل هالحدث (الـ value tracker تبعه بيشوف القيمة نفسها)، فـ react-hook-form ما شاف القيمة وطلع الطلب بـ `"company":""`. النتيجة: كل فحص نجاح على الـ production build بعت إيميل حقيقي. **انبعت حوالي 20 رسالة زيادة** عن التلاتة المقصودين: "Phase 10 test honeypot" (4)، "Phase 10 test honeypot-reduced" (4)، "Keyboard Tester" (1)، و"Loader Test" (11، من فحوصات الـ loader). الموقع نفسه ما فيه غلط: الغلط بسكربت الفحص.
  - **التصليح:** السكربت صار يعبّي الحقل بالـ setter الأصلي (`Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set`)، وسيرفر الفحص صار يشتغل بـ `RESEND_API_KEY` غلط إلا إذا انطلب إرسال حقيقي صريح، فولا فحص بيقدر يبعت بالغلط.
  - **الـ honeypot انفحص عن جد بعدها** (على سيرفر ما بيقدر يبعت): الحقل فاضي ← الـ action حاول يبعت وفشل ("The message didn't send. Please try again later."، وبسجل السيرفر `resend error 401: API key is invalid`)، والنص المكتوب ضل. الحقل معبّى (`"company":"Bot Inc."` بالطلب) ← "Message sent!" بدون أي محاولة إرسال (ولا سطر `resend error` جديد). وبعدها الـ 36 فحص تبع السلوك والـ 17 تبع الـ loader انعادوا على نفس السيرفر: ناجحين كلهم، وسجل السيرفر ضل فيه سطر الخطأ الواحد تبع التجربة المقصودة.
- **الأخطاء بتحرّك الفورم، وبيضل هيك (قرار صاحب الموقع، 2026-10-09):** رسالة الإيميل ("Enter a valid email address, like name@company.com.") بتلف لسطرين بكل العروض، ورسالة الاسم كمان، وعلى 375px التلاتة. `.field-error` بيحجز سطر واحد (`min-height: 1.5em`)، فالفورم بيطول من 533 لـ 558px من 768px وطالع، ومن 671 لـ 772px على 375. المرجع نفس الأرقام بالضبط. انعرضت 3 خيارات (نخليه، نحجز سطرين، نقصّر الرسائل)، وصاحب الموقع قال الفورم تمام متل ما هو.
- **الـ focus بعد الإرسال بيروح على `<body>`، وبيضل هيك (قرار صاحب الموقع، 2026-10-09):** طلب إنو الزر يضل `disabled` وقت الإرسال مشان ما ينكبس مرة تانية (من الخطة وv1، والمرجع بيعمل `submit.disabled = true`). عنصر عليه الـ focus بيخسره لما يصير disabled. بـ Chrome الـ Tab اللي بعدها بيروح على "Back to title"، فالكيبورد ما بيضيع. البديل اللي انعرض وما انأخد: `aria-disabled` بدل `disabled`.
- **إضافة بعد المرحلة (2026-10-09، بطلب صاحب الموقع): loader على زر الإرسال.** وقت الإرسال أيقونة الظرف بتتبدّل بـ loader، والزر `disabled`. رسالة النجاح أو الخطأ بتضل تطلع بالـ status تحت متل ما كانت، و"Sending…" كمان.
  - `contact-form.tsx`: `{isSubmitting ? <span className="loader" aria-hidden="true" /> : <PixelIcon name="mail" />}`. النص "Send message" ما بيتغيّر.
  - `contact.css`، تحت تعليقين "إضافة عن المرجع": `.loader` بمقاس الأيقونة (18px): حلقة من 8 مربعات 4px بلون ظل الزر (`--lo`)، ومربع بلون النص بيلف عليها مع عقارب الساعة ووراه ذيل (`loader-walk 0.8s step-end`، 8 خطوات). CSS بس، بدون sprite جديد: الـ sprites لازم تضل مطابقة للمرجع. و`.form .btn:disabled { pointer-events: none }`: الزر المعطّل ما بياخد مؤشر الإيد ولا تفتيح الـ hover ولا نزلة الكبسة (المرجع ما فيه شكل للزر المعطّل).
  - مع reduced motion الـ loader بيطلع واقف (الراس خطوة قدّام الذيل)، و"Sending…" تحت هي اللي بتقول إنو في إرسال.
  - **الفحص** (17 فحص على الـ production build، بسيرفر ما بيقدر يبعت إيميل، وطلب الـ action موقّف لحظات مشان ينقاس): الـ loader بمكان الأيقونة بالضبط، والزر والسطر تبعه ما بيتحرّكوا ولا بكسل على 1280 و375؛ الراس بيمر على الـ 8 أماكن بالترتيب والذيل وراه بخطوة؛ كبستين عالزر وEnter من حقل وقت الإرسال ← طلب واحد بس؛ بعد النجاح الأيقونة بترجع والزر بيشتغل والرسالة بالأخضر تحت؛ لما الطلب يفشل الرسالة بالأحمر تحت والنص المكتوب بيضل. ارتفاع الفورم بيزيد 0.9px لما سطر الـ status ياخد نص، ونفس الشي كان قبل الإضافة. وبعد الإضافة انعادت المقارنة مع المرجع بالـ 39 حالة تبع Contact: ولا فرق بالـ styles ولا بالبنية وولا بكسل (الـ loader ما بيبين إلا وقت الإرسال).
- **محتوى بعد المرحلة (2026-10-09، بطلب صاحب الموقع): رقم الاتصال والواتساب وGitHub وFacebook.**
  - `site.ts`: `phone` و`whatsapp` (`+963 933 981 269`، نفس الرقم، محلياً 0933 981 269)، `socials.github`، و`socials.others` فيه Facebook. الإيميل وLinkedIn لسا `null`.
  - `contact.tsx`: ترتيب السطور Email، Phone (`tel:+963933981269`، بنفس التاب)، WhatsApp (`https://wa.me/963933981269`، تاب جديد)، LinkedIn، GitHub، سطر لكل حساب بـ `socials.others` (كانوا يطلعوا بالـ credits بس)، وبعدين Location. روابط الـ credits والـ `sameAs` بالـ JSON-LD أخدوا GitHub وFacebook لحالهم.
  - **أيقونتين جداد: `phone` و`chat`.** ولا وحدة من الـ 31 أيقونة تبع المرجع بتنفع لتلفون أو محادثة. انرسموا 9×9 بنفس الصيغة وانحطوا بـ `EXTRA_ICONS` برّا `ICONS`، و`buildExtraSpriteCss()` بيكتبهم بعد ناتج المرجع بـ `sprites.generated.css`. `sprites:check` لسا بيقارن ناتج المرجع لحاله وناجح. Facebook أخد أيقونة `profile` (المرجع بيستعمل أيقونات عامة مش شعارات: `profile` لـ LinkedIn و`branch` لـ GitHub).
  - **الفحص** (20 فحص على الـ production build، 19 ناجحين، والمواقع الخارجية stub): السطور بالترتيب وبالروابط الصح، الروابط الخارجية بتفتح تاب جديد بـ `opener` فاضي، الأيقونات الخمسة مرسومة بمقاس 18px، الـ hover بيدهّب الإطار، ترتيب الـ Tab صح، وما في overflow أفقي على 1024 و768 و375. على 1280 كل سطر على سطر واحد، وعلى 375 رابطي GitHub وFacebook بيلفّوا لسطرين (متل رابط LinkedIn بالمرجع). فحص واحد ما مرق: على 320px في overflow أفقي 18px، وهو بالمرجع نفسه بنفس الرقم (زر "Download CV (PDF)" عرضه 274px وبيدفش النافذة لـ 324px)، ومش من هالإضافة.
  - **المقارنة مع المرجع** انعادت بالـ 39 حالة (سطور النسخة وCSS الأيقونتين انحطوا بالمرجع): ولا فرق بالـ styles ولا بالبنية وولا بكسل. نافذة الروابط صارت أطول من الفورم على 1280 (584px مقابل 533px).
- **سيرفر الـ dev:** مرحلة Contact بدون أي رسالة من الكود بالـ console. سجل الـ dev فيه تحذير hydration بس من إضافات بالمتصفح (`bis_skin_checked`، و`cz-shortcut-listen` من ColorZilla)، وما بيطلع بمتصفح بدون إضافات.
- **الفحص كله على Chrome 154.** Safari وFirefox ما انفحصوا.
