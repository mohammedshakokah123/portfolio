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
        {/* disabled وقت الإرسال: لا كبسة تانية ولا Enter من الحقول بيبعتوا الرسالة مرتين */}
        <button type="submit" className={btn()} disabled={isSubmitting}>
          {/* إضافة عن المرجع: الـ loader مكان الأيقونة وقت الإرسال (contact.css). النتيجة بتطلع بالـ status تحت */}
          {isSubmitting ? (
            <span className="loader" aria-hidden="true" />
          ) : (
            <PixelIcon name="mail" />
          )}
          Send message
        </button>
      </div>

      <p
        className={cn(
          "form-status",
          status?.tone === "ok" && "ok",
          status?.tone === "bad" && "bad",
        )}
        role="status"
        aria-live="polite"
      >
        {status?.msg}
      </p>
    </form>
  );
}
