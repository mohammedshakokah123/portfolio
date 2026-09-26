// zod/mini مش "zod": نفس الفحص بس الـ API بالـ functions بدل الـ methods، فالـ bundler بيشيل اللي مش مستعمل.
// الـ schema بيوصل للـ client (react-hook-form)، و"zod" الكامل كان أكبر chunk JS بالرئيسية.
import * as z from "zod/mini";

/** رسالة الـ status لما في حقول غلط (بالـ client وبالـ server، نفس النص) */
export const CONTACT_INVALID_MSG = "Check the highlighted fields and try again.";

/**
 * نفس الـ schema بالـ client (react-hook-form) وبالـ server action، ونفس رسائل التصميم بالحرف.
 * الـ trim قبل الفحص مشان "   " ما تنحسب اسم، والـ max مشان ما حدا يبعتلنا رسالة بحجم كتاب.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .check(
      z.trim(),
      z.minLength(2, "Enter your name (at least 2 characters)."),
      z.maxLength(100, "Keep your name under 100 characters."),
    ),
  // z.email() بـ zod 4 بيفحص قبل أي trim، فمنعمل trim أول وبعدين pipe للفحص
  email: z.pipe(
    z.string().check(z.trim()),
    z
      .email("Enter a valid email address, like name@company.com.")
      .check(z.maxLength(254, "Keep your email address under 254 characters.")),
  ),
  message: z
    .string()
    .check(
      z.trim(),
      z.minLength(20, "Write a message of at least 20 characters."),
      z.maxLength(5000, "Keep your message under 5,000 characters."),
    ),
  // Honeypot: حقل مخفي، البشر ما بيعبّوه. ما منحط max(0) هون: وقتها البوت بياخد خطأ validation
  // وبيعرف إنه انكشف. بدالها الـ action بيرجّع نجاح وهمي بدون إرسال.
  company: z.optional(z.string()),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof ContactInput, string[]>> };
