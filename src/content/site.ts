import { davinda, productionYears, university } from "@/content/experience";
import { formatPeriod, formatYearCount, formatYears } from "@/lib/dates";
import type { SiteConfig } from "@/types/content";

/**
 * بالترتيب: الرابط اللي حاطينه بإيدنا، بعدين الـ production domain اللي Vercel بيعطيه
 * تلقائياً، وبالآخر localhost (بس بالتطوير). منشيل المسافات، وإذا ما في scheme
 * منضيف https://، وأي رابط غلط بيوقّف الـ build برسالة واضحة.
 * منرجّع الـ origin بس (متل "https://example.com"): حروف صغيرة وبدون "/" بالآخر.
 */
function resolveSiteUrl() {
  // الـ trim قبل الـ || مشان قيمة فيها مسافات بس تنحسب فاضية ونروح عالخيار اللي بعدها
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (!raw) {
    // بالـ production الـ fallback لـ localhost بيطلّع canonical وsitemap وJSON-LD غلط بدون ما حدا ينتبه
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "NEXT_PUBLIC_SITE_URL is not set. Set it to the live URL (or http://localhost:3000 for a local production build).",
      );
    }
    return "http://localhost:3000";
  }
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  // new URL بدل URL.canParse: الأخيرة مش موجودة بـ Safari < 17 إذا الملف وصل للمتصفح
  try {
    return new URL(url).origin;
  } catch {
    throw new Error(`Invalid site URL "${raw}"`);
  }
}

const name = "Mohammad Shaquqa";
const role = "Frontend Engineer";
const availability = "Available for full-time roles";
/** مجموع سنين الخبرة الهندسية (مش بس الـ production) */
const engineeringYears = "3+";

/** رقم الاتصال والواتساب (محلياً 0933 981 269) بالصيغة الدولية */
const phone = "+963 933 981 269";

/** آخر مرة تغيّر فيها المحتوى (الـ sitemap والـ JSON-LD). حدّثه يدوياً، مش new Date() */
export const contentUpdatedAt = "2026-10-09";

export const site: SiteConfig = {
  name,
  shortName: "M. Shaquqa",
  // TODO(SEO): أكّد كل طرق كتابة الاسم اللي ممكن حدا يبحث فيها
  alternateNames: ["محمد شقوقة" /* , "Mohammad Shakokah", "Mohammed Shaquqa" ... */],
  role,
  url: resolveSiteUrl(),
  description: `${name}, ${role} specializing in React, Next.js and TypeScript. ${engineeringYears} years of engineering experience building production web applications.`,
  ogDescription:
    "React, Next.js and TypeScript engineer building production-grade web applications.",
  keywords: [
    name,
    role,
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Latakia",
    "Syria",
  ],
  email: null, // TODO: الإيميل الحقيقي
  phone,
  whatsapp: phone, // نفس الرقم
  location: "Latakia, Syria, open to remote and relocation",
  cvPath: "/cv/Mouhammad-Shakokah-CV.pdf",
  profileImage: null, // TODO: "/profile.jpg" لما تنحط الصورة
  availability,
  socials: {
    linkedin: null, // TODO: رابط LinkedIn الحقيقي
    github: "https://github.com/mohammedshakokah123",
    // أي حساب تاني (X، Stack Overflow...) بينضاف هون
    others: [{ label: "Facebook", url: "https://www.facebook.com/mohammed.shakokah" }],
  },
  stageSubs: {
    about: "Player profile: who I am and how I work.",
    skills: "Inventory: the tools I use in production, grouped by where they sit in the stack.",
    experience: "Quest log: work and education, most recent first.",
    projects:
      "Business systems built for real operational needs. Pick a cartridge for the architecture details.",
    contact:
      "Save point. Hiring for a frontend or full-time software engineering role? Send a message and I'll reply within one business day.",
  },
  home: {
    lead: `${role} specializing in React, Next.js, and modern web applications.`,
    sub: `${engineeringYears} years of engineering experience delivering responsive user interfaces, integrating state management architectures, and building production-grade web systems.`,
    facts: [
      {
        icon: "cap",
        text: `Software Engineering Graduate (${university.org}, ${formatPeriod(university.period)})`,
      },
      {
        icon: "briefcase",
        text: `${formatYears(productionYears)} production experience at ${davinda.org}`,
      },
      { icon: "check", text: availability, tone: "green" },
    ],
  },
  about: {
    stats: [
      { label: "Main stack", value: "React, Next.js, TypeScript" },
      { label: "State & data", value: "Zustand, Redux, TanStack Query" },
      {
        label: "XP",
        value: `${engineeringYears} years total, ${formatYearCount(productionYears)} in production`,
      },
      { label: "Base", value: "Latakia, Syria" },
      { label: "Open to", value: "Full-time, on-site or remote" },
    ],
    paragraphs: [
      [
        // الاسم الكامل والدور والمدينة بجملة طبيعية ← SEO
        "I'm ",
        { emphasis: name },
        ", a frontend engineer based in Latakia, Syria. I care about the parts of a product users touch every day: fast screens, predictable state, and interfaces that behave the same on a 5-inch phone and a 27-inch monitor.",
      ],
      [
        "At ",
        { emphasis: davinda.org },
        ", I shipped production features end to end, from translating Figma designs into reusable components to wiring them into REST and WebSocket APIs with caching, loading, and error states handled properly. My Software Engineering degree gives me a solid grounding in algorithms, databases, and software architecture, which shapes how I structure frontend codebases that teams can maintain.",
      ],
    ],
    abilities: [
      {
        icon: "layers",
        title: "Maintainable architecture",
        description: "Typed components, clear state boundaries, and folder structures that scale.",
      },
      {
        icon: "bolt",
        title: "Performance by default",
        description: "Code splitting, request caching, and avoiding needless re-renders.",
      },
      {
        icon: "access",
        title: "Accessible interfaces",
        description: "Semantic HTML, keyboard support, and accessible component primitives.",
      },
    ],
  },
  footer: { credit: `${university.title}, ${university.org}.` },
};
