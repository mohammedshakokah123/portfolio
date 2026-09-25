# 08: قسم Contact (الفورم + Server Action + Resend)

**المرجع:** `design/reference.html` الأسطر 544 لـ 625 (HTML) و926 لـ 1010 (JS).

## الهدف
فورم بيبعت **إيميل حقيقي** عن طريق Server Action وResend، مع validation مشترك بين الـ client والـ server، ونفس رسائل الخطأ ونفس سلوك الـ accessibility اللي بالتصميم.

## 1. إعداد Resend
1. اعمل حساب على [resend.com](https://resend.com) وخذ **API key**.
2. للتجربة: `CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"` (بيبعت بس على إيميل الحساب نفسه).
3. للـ production: اعمل **Verify** لـ domain (DNS records)، وبعدها غيّر الـ from لـ `contact@yourdomain.com`.
4. `.env.local`:
   ```bash
   RESEND_API_KEY=re_xxx
   CONTACT_TO_EMAIL=you@gmail.com
   CONTACT_FROM_EMAIL="Portfolio <onboarding@resend.dev>"
   ```

## 2. الـ Schema: `src/lib/validations/contact.ts`
```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name (at least 2 characters)."),
  email: z.string().trim().email("Enter a valid email address, like name@company.com."),
  message: z.string().trim().min(20, "Write a message of at least 20 characters.").max(5000),
  // Honeypot: حقل مخفي، البشر ما بيعبّوه
  company: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactInput, string[]>> };
```
> نفس رسائل الخطأ تبع التصميم بالحرف.

## 3. الـ Server Action: `src/app/actions/contact.ts`
```ts
"use server";

import { Resend } from "resend";
import { contactSchema, type ContactResult } from "@/lib/validations/contact";
import { site } from "@/content/site";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContact(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Check the highlighted fields and try again.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, message, company } = parsed.data;
  if (company) return { ok: true }; // bot ← منعمل حالنا نجحنا بدون إرسال

  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL!,
    to: process.env.CONTACT_TO_EMAIL!,
    replyTo: email,
    subject: `Portfolio enquiry from ${name}`,
    text: `${message}\n\n${name}\n${email}`,
  });

  if (error) {
    console.error("[contact] resend error", error);
    return {
      ok: false,
      error: site.email
        ? `The message didn't send. Email ${site.email} directly instead.`
        : "The message didn't send. Please try again later.",
    };
  }
  return { ok: true };
}
```
- **الـ validation على السيرفر إجباري**. الـ client validation بس لتجربة المستخدم.
- **Rate limit (اختياري):** `Map<ip, timestamps>` بالذاكرة (الـ IP من `headers().get("x-forwarded-for")`)، مثلاً 3 رسائل كل 10 دقايق. بـ Vercel الذاكرة مش مشتركة بين الـ instances، فإذا صار في spam حقيقي انتقل لـ Upstash Ratelimit.

## 4. الفورم: `src/components/contact/contact-form.tsx` (`"use client"`)
```tsx
const form = useForm<ContactInput>({
  resolver: zodResolver(contactSchema),
  mode: "onTouched",           // متل التصميم: validate عند الـ blur، وبعدها عند الـ input
  defaultValues: { name: "", email: "", message: "", company: "" },
  shouldFocusError: true,      // focus على أول حقل غلط
});
const [status, setStatus] = useState<{ tone: "ok" | "error"; msg: string } | null>(null);

async function onSubmit(values: ContactInput) {
  setStatus({ tone: "ok", msg: "Sending…" });
  const res = await sendContact(values);
  if (res.ok) {
    form.reset();
    setStatus({ tone: "ok", msg: "Message sent. I'll reply within one business day." });
    toast.success("Message sent");
  } else {
    // رجّع أخطاء السيرفر للحقول
    Object.entries(res.fieldErrors ?? {}).forEach(([k, v]) =>
      form.setError(k as keyof ContactInput, { message: v?.[0] }));
    setStatus({ tone: "error", msg: res.error });
  }
}
```

### البنية (مع مكونات shadcn `Field`)
```tsx
<form onSubmit={form.handleSubmit(onSubmit, () => setStatus({ tone: "error", msg: "Check the highlighted fields and try again." }))}
      noValidate aria-describedby="form-note"
      className="rounded-lg border border-border bg-card/30 p-6 sm:p-8">
  <div className="grid gap-5 sm:grid-cols-2">
    <Controller name="name" control={form.control} render={({ field, fieldState }) => (
      <Field data-invalid={fieldState.invalid}>
        <FieldLabel htmlFor="cf-name">Name</FieldLabel>
        <Input {...field} id="cf-name" autoComplete="name" placeholder="Jane Doe"
               aria-invalid={fieldState.invalid} className="h-11 bg-background" />
        <FieldError errors={[fieldState.error]} />
      </Field>
    )} />
    {/* email: type="email" autoComplete="email" placeholder="jane@company.com" */}
  </div>
  {/* message: Textarea rows={5} className="resize-y" placeholder="Role, team, and a little about what you're building" */}

  {/* Honeypot: مخفي عن البشر وعن قارئ الشاشة */}
  <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" {...form.register("company")} />

  <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
    <p id="form-note" className="text-xs text-subtle">All fields are required.</p>
    <Button type="submit" size="lg" disabled={form.formState.isSubmitting}>
      {form.formState.isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
      Send message
    </Button>
  </div>

  <p role="status" aria-live="polite"
     className={cn("mt-4 min-h-5 text-sm", status?.tone === "error" ? "text-destructive" : "text-success")}>
    {status?.msg}
  </p>
</form>
```
- **حجز مساحة للأخطاء:** التصميم بيستعمل `min-h-[1.25rem]` تحت كل حقل مشان ما يصير الـ layout يقفز. طبّق نفس الشي على `FieldError` (أو wrapper بـ `min-h-5`).
- الـ inputs: `focus-visible:border-brand focus-visible:ring-ring/30` و`aria-invalid:border-destructive` (shadcn بيدعم `aria-invalid` بشكل افتراضي).

## 5. القسم: `src/components/sections/contact.tsx`
```tsx
<Section id="contact" labelledBy="contact-title" bordered={false}
         className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
  <div>
    <h2 id="contact-title" ...>{site.sections.contact.title}</h2>
    <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">{site.sections.contact.description}</p>
    <ul className="mt-8 space-y-3 text-sm">
      {/* كل رابط بينعرض بس إذا مش null */}
      {site.email && <ContactLink href={`mailto:${site.email}`} icon={<Mail/>}>{site.email}</ContactLink>}
      {site.socials.linkedin && <ContactLink href={site.socials.linkedin} external icon={<LinkedInIcon/>}>linkedin.com/in/…</ContactLink>}
      {site.socials.github && <ContactLink href={site.socials.github} external icon={<GitHubIcon/>}>github.com/…</ContactLink>}
      <li> <MapPin/> {site.location} </li>
    </ul>
  </div>
  <ContactForm />
</Section>
```
- `ContactLink`: `group inline-flex items-center gap-3` مع مربع أيقونة `grid size-9 place-items-center rounded-md border border-border text-muted-foreground group-hover:border-input group-hover:text-brand`.

## 6. أيقونات البراندات: `src/components/shared/brand-icons.tsx`
lucide شالت أيقونات البراندات (LinkedIn وGitHub)، فمنسخ الـ SVG paths من التصميم (الأسطر 566 و575) كمكونات:
```tsx
export function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}><path d="M20.447 20.452h-3.554…" /></svg>;
}
```

## ضيفه لـ `page.tsx`
```tsx
<Hero /> <About /> <Skills /> <Experience /> <Projects /> <Contact />
```

## Definition of Done
- [ ] Submit فاضي: 3 رسائل خطأ، والـ focus على أول حقل، ورسالة الـ status حمرا.
- [ ] Validation عند الـ blur، والخطأ بيختفي وقت تصحّح.
- [ ] Submit صحيح: الإيميل **بيوصل فعلاً** لـ `CONTACT_TO_EMAIL`، و`Reply-To` هو إيميل الزائر.
- [ ] الفورم بيرجع فاضي، ورسالة النجاح خضرا، وفي toast.
- [ ] وقت الإرسال الزر disabled وفيه spinner.
- [ ] إذا عبّأت الـ honeypot (من DevTools) ما بيوصل إيميل.
- [ ] إرسال بيانات غلط مباشرة للـ action (بتجاوز الـ client) بيرفضها السيرفر.
- [ ] ما في layout shift لما تظهر الأخطاء.
- [ ] (من مرحلة 05) الـ Active nav على الصفحة الكاملة: كل روابط الـ nav وأزرار الـ Hero بتوصل لأقسامها، وContact بيتميّز بآخر الصفحة. واكبس "Projects" من الـ nav وتأكد إنه Projects هو اللي بيتميّز مش Contact، على 1280×800 وعلى شاشة طويلة (مثلاً 1280×1400). إذا Contact خطف التمييز، خلّي تمييز "آخر الصفحة" بـ `useActiveSection` يشتغل بس إذا آخر قسم عم يبيّن فعلاً عالشاشة.
