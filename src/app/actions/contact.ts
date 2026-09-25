"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

import { site } from "@/content/site";
import { CONTACT_INVALID_MSG, contactSchema, type ContactResult } from "@/lib/validations/contact";

const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000;
/** ما منمسح الـ IPs القديمة إلا لما الـ Map تكبر لهالحد، مشان ما نلف عليها كلها بكل request */
const PRUNE_AT = 1000;
/**
 * Rate limit بالذاكرة: 3 رسائل كل 10 دقايق لكل IP. بـ Vercel كل instance إلها ذاكرتها، فهاد
 * بيوقّف الـ spam البسيط بس. إذا صار في spam حقيقي انتقل لـ Upstash Ratelimit.
 */
const sentAt = new Map<string, number[]>();

/**
 * بيحجز محاولة للـ IP ويرجّع true، أو false إذا خلص الحد. منحجز قبل الإرسال (مش بعده) مشان
 * كذا request بنفس اللحظة ما يفوتوا كلهم، وإذا فشل الإرسال منرجّع المحاولة بـ releaseSlot.
 */
function reserveSlot(ip: string, now: number) {
  if (sentAt.size > PRUNE_AT) {
    for (const [key, times] of sentAt) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) sentAt.delete(key);
    }
  }
  const recent = (sentAt.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  sentAt.set(ip, [...recent, now]);
  return true;
}

/** الإرسال فشل (مش ذنب الزائر) ← ما منحسبها عليه */
function releaseSlot(ip: string, reservedAt: number) {
  const times = sentAt.get(ip);
  if (!times) return;
  const i = times.lastIndexOf(reservedAt);
  if (i !== -1) times.splice(i, 1);
}

/**
 * x-real-ip بـ Vercel بيحطه Vercel نفسه (الزائر ما بيقدر يزوّره). غيره منرجع لأول IP بالـ
 * x-forwarded-for. إذا ما في ولا واحد منرجّع null وما منعمل rate limit، أحسن ما كل الزوار
 * يتشاركوا نفس الـ bucket ("unknown") ويسكّروا الفورم على بعض.
 */
async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip")?.trim() || h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

const sendFailed = (): ContactResult => ({
  ok: false,
  error: site.email
    ? `The message didn't send. Email ${site.email} directly instead.`
    : "The message didn't send. Please try again later.",
});

export async function sendContact(input: unknown): Promise<ContactResult> {
  // الـ validation هون إجباري: أي حدا بيقدر يبعت POST للـ action بدون ما يمرق عالفورم
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: CONTACT_INVALID_MSG,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { name, email, message, company } = parsed.data;
  if (company) return { ok: true }; // bot ← منعمل حالنا نجحنا بدون إرسال

  // الإعدادات قبل الـ rate limit: إذا ناقصة ما في داعي نحجز محاولة
  const { RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL } = process.env;
  // منعمل الـ client هون مش بأول الملف: new Resend() بيرمي error إذا الـ key ناقص
  if (!RESEND_API_KEY || !CONTACT_TO_EMAIL || !CONTACT_FROM_EMAIL) {
    console.error("[contact] missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL");
    return sendFailed();
  }

  const ip = await clientIp();
  const now = Date.now();
  if (ip && !reserveSlot(ip, now)) {
    return {
      ok: false,
      error: "Too many messages in a short time. Please try again in a few minutes.",
    };
  }

  let failure: string | null;
  try {
    const { error } = await new Resend(RESEND_API_KEY).emails.send({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      replyTo: email,
      // أي سطر جديد أو tab بالاسم بيصير مسافة: الـ subject لازم يكون سطر واحد
      subject: `Portfolio enquiry from ${name.replace(/\s+/g, " ")}`,
      text: `${message}\n\n${name}\n${email}`,
    });
    // كـ string: الـ logger تبع Next بيطبع الـ object أحياناً {}
    failure = error && `${error.statusCode}: ${error.name}: ${error.message}`;
  } catch (err) {
    failure = String(err); // انقطاع شبكة أو شي ما رجّعه الـ SDK كـ error
  }

  if (failure) {
    if (ip) releaseSlot(ip, now);
    console.error(`[contact] resend error ${failure}`);
    return sendFailed();
  }
  return { ok: true };
}
