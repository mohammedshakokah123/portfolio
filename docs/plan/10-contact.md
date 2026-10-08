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
- [ ] `/#contact`: صندوق البريد بالعالم. نافذة الروابط عاليسار والفورم عاليمين (أعرض)، وتحتهم نافذة الـ credits. من 1023px ونازل: عمود واحد.
- [ ] مع المحتوى الحالي: سطر "Location" بس (الإيميل وLinkedIn وGitHub لسا `null`) وزر الـ CV. جرّب مؤقتاً قيمة لـ `site.email` ← بيطلع سطر الإيميل بأيقونة teal، وبالـ hover إطاره دهبي. رجّعها.
- [ ] الحقول: خلفية غامقة، إطار أبيض بزوايا مقصوصة، وبالـ focus بيصير دهبي. المؤشر دهبي.
- [ ] Name وEmail جنب بعض، وتحت 720px تحت بعض.
- [ ] الـ credits: "Thanks for playing" بالدهبي، والروابط تحتها **عليها underline**.

**الـ validation:**
- [ ] إرسال والفورم فاضي: الحقول التلاتة إطارها أحمر، رسالة تحت كل حقل، الـ status "Check the highlighted fields and try again." بالأحمر، والـ focus على Name.
- [ ] كتابة حرف واحد بـ Name ← الرسالة بتضل. كتابة حرفين ← بتختفي والإطار بيرجع.
- [ ] إيميل غلط ← "Enter a valid email address, like name@company.com."
- [ ] ظهور الأخطاء واختفاؤها ما بيحرّك باقي الفورم (المساحة محجوزة).
- [ ] مع الصوت مفعّل: صوت الخطأ عند كل إرسال فاشل.

**الإرسال:**
- [ ] رسالة صحيحة ← "Sending…" والزر disabled ← "Message sent! I'll reply within one business day." بالأخضر، الفورم بيفضى، confetti من عند الزر، وصوت النجاح.
- [ ] **الإيميل وصل فعلاً** على `CONTACT_TO_EMAIL`، والـ Reply-To هو إيميل المرسل.
- [ ] 4 رسائل ورا بعض ← الرابعة: "Too many messages in a short time…".
- [ ] أي كتابة بعد النتيجة بتمسح رسالة الـ status.

**Accessibility:**
- [ ] كل حقل مربوط بالـ label تبعه وبرسالة خطؤه (`aria-describedby`)، و`aria-invalid` بيتبدّل.
- [ ] الـ status `role="status"`: قارئ الشاشة بيقرأ النتيجة بدون ما يتحرك الـ focus.
- [ ] الأسهم يمين/يسار جوّا الحقول بتحرّك المؤشر، **مش** المرحلة.
- [ ] "Back to title" بيرجّع لشاشة البداية مع الانتقال.

**عام:**
- [ ] `prefers-reduced-motion`: ما في confetti، والباقي متل ما هو.
- [ ] `npm run lint && npm run build && npm run sprites:check` ناجحين.
