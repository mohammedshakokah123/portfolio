"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Controller, useForm, type FieldError as FormFieldError } from "react-hook-form";
import { toast } from "sonner";

import { sendContact } from "@/app/actions/contact";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CONTACT_INVALID_MSG, contactSchema, type ContactInput } from "@/lib/validations/contact";

type Status = { tone: "pending" | "ok" | "error"; msg: string } | null;

const toneClass = {
  pending: "text-muted-foreground",
  ok: "text-success",
  error: "text-destructive",
} as const;

// نفس ستايل التصميم: h-11، خلفية الصفحة، وborder بلون البراند وقت الـ focus
const controlClass =
  "bg-background dark:bg-background placeholder:text-subtle focus-visible:border-brand focus-visible:ring-ring/30 px-3";

export function ContactForm() {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched", // متل التصميم: validate عند الـ blur، وبعدها مع كل input
    defaultValues: { name: "", email: "", message: "", company: "" },
    shouldFocusError: true, // focus على أول حقل غلط
  });
  const [status, setStatus] = useState<Status>(null);

  async function onSubmit(values: ContactInput) {
    // لون محايد: لسا ما نجح شي (التصميم كان يعرضها بالأخضر)
    setStatus({ tone: "pending", msg: "Sending…" });
    try {
      const res = await sendContact(values);
      if (res.ok) {
        form.reset();
        setStatus({ tone: "ok", msg: "Message sent. I'll reply within one business day." });
        // الـ toast للعين بس: الـ role="status" تحت هو اللي بيقرأه قارئ الشاشة، وبدون
        // aria-hidden الـ live region تبع sonner بيعيد نفس الخبر مرة تانية
        toast.success(<span aria-hidden>Message sent</span>);
        return;
      }
      // رجّع أخطاء السيرفر للحقول، والـ focus على أول واحد غلط
      const fieldErrors = Object.entries(res.fieldErrors ?? {}) as [
        keyof ContactInput,
        string[] | undefined,
      ][];
      fieldErrors.forEach(([name, messages], i) =>
        form.setError(name, { message: messages?.[0] }, { shouldFocus: i === 0 }),
      );
      setStatus({ tone: "error", msg: res.error });
    } catch (err) {
      // انقطع النت، أو deploy جديد غيّر الـ action ID ("Failed to find Server Action")
      console.error("[contact]", err);
      setStatus({
        tone: "error",
        msg: "The message didn't send. Check your connection, refresh the page, and try again.",
      });
    }
  }

  const { isSubmitting } = form.formState;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit, () =>
        setStatus({ tone: "error", msg: CONTACT_INVALID_MSG }),
      )}
      // أي تعديل بعد النتيجة بيمسحها: خطأ قديم أو "Message sent" ما عاد إلهم علاقة بالنص الجديد
      onChange={() => {
        if (status && !isSubmitting) setStatus(null);
      }}
      noValidate
      aria-describedby="form-note"
      className="border-border bg-card/30 rounded-lg border p-6 sm:p-8"
    >
      <div className="grid gap-x-5 gap-y-1 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor="cf-name">Name</FieldLabel>
              <Input
                {...field}
                id="cf-name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
                aria-invalid={fieldState.invalid}
                aria-describedby="cf-name-error"
                className={cn("h-11", controlClass)}
              />
              <ErrorText id="cf-name-error" error={fieldState.error} />
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="gap-2">
              <FieldLabel htmlFor="cf-email">Email</FieldLabel>
              <Input
                {...field}
                id="cf-email"
                type="email"
                autoComplete="email"
                placeholder="jane@company.com"
                aria-invalid={fieldState.invalid}
                aria-describedby="cf-email-error"
                className={cn("h-11", controlClass)}
              />
              <ErrorText id="cf-email-error" error={fieldState.error} />
            </Field>
          )}
        />
      </div>

      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="mt-1 gap-2">
            <FieldLabel htmlFor="cf-message">Message</FieldLabel>
            <Textarea
              {...field}
              id="cf-message"
              rows={5}
              placeholder="Role, team, and a little about what you're building"
              aria-invalid={fieldState.invalid}
              aria-describedby="cf-message-error"
              // field-sizing-content تبع shadcn بيتجاهل الـ rows، فمنرجّع الارتفاع الثابت متل التصميم
              className={cn("field-sizing-fixed min-h-32 resize-y py-2.5", controlClass)}
            />
            {/* الرسالة بعرض الفورم كله، فمن sm وطالع بتكفيها سطر واحد */}
            <ErrorText id="cf-message-error" error={fieldState.error} className="sm:min-h-5" />
          </Field>
        )}
      />

      {/* Honeypot: مخفي عن البشر وعن قارئ الشاشة، وما بياخد focus بالـ Tab */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
        {...form.register("company")}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
        <p id="form-note" className="text-subtle text-xs">
          All fields are required.
        </p>
        <Button type="submit" size="lg" disabled={isSubmitting} className="h-11 gap-2 px-5">
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Send className="size-4" aria-hidden />
          )}
          Send message
        </Button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn("mt-4 min-h-5 text-sm", status && toneClass[status.tone])}
      >
        {status?.msg}
      </p>
    </form>
  );
}

/**
 * متل التصميم: الـ <p> دايماً موجود ومساحته محجوزة، فظهور الخطأ ما بيحرّك الـ layout، والـ input
 * مربوط فيه بـ aria-describedby (بدل role="alert" تبع FieldError اللي بيقاطع قارئ الشاشة).
 * min-h-8 = سطرين: رسالة الإيميل بتنكسر لسطرين بالعمود النص، أو عالموبايل الضيّق.
 */
function ErrorText({
  id,
  error,
  className,
}: {
  id: string;
  error?: FormFieldError;
  className?: string;
}) {
  return (
    <p id={id} className={cn("text-destructive min-h-8 text-xs", className)}>
      {error?.message}
    </p>
  );
}
