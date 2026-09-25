import { Accessibility, Briefcase, CircleCheck, Gauge, GraduationCap, Layers } from "lucide-react";

import { davinda, productionYears, university } from "@/content/experience";
import { formatPeriod, formatYearCount, formatYears } from "@/lib/dates";
import type { SiteConfig } from "@/types/content";

/**
 * بالترتيب: الرابط اللي حاطينه بإيدنا، بعدين الـ production domain اللي Vercel بيعطيه
 * تلقائياً، وبالآخر localhost (بس للتطوير المحلي). منشيل المسافات، وإذا ما في scheme
 * منضيف https://، وأي رابط غلط بيوقّف الـ build برسالة واضحة.
 * منرجّع الـ origin بس (متل "https://example.com"): حروف صغيرة وبدون "/" بالآخر.
 */
function resolveSiteUrl() {
  // الـ trim قبل الـ || مشان قيمة فيها مسافات بس تنحسب فاضية ونروح عالخيار اللي بعدها
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    "http://localhost:3000";
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

export const site: SiteConfig = {
  name,
  // TODO(SEO): أكّد كل طرق كتابة الاسم اللي ممكن حدا يبحث فيها
  alternateNames: ["محمد شقوقة" /* , "Mohammad Shakokah", "Mohammed Shaquqa" ... */],
  role,
  url: resolveSiteUrl(),
  description: `${name}, ${role} specializing in React, Next.js and TypeScript. ${engineeringYears} years of engineering experience building production-grade web applications.`,
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
  location: "Latakia, Syria, open to remote and relocation",
  cvPath: "/cv/Mohammad-Shaquqa-CV.pdf",
  profileImage: null, // TODO: "/profile.jpg" لما تنحط الصورة
  availability,
  socials: {
    linkedin: null, // TODO: رابط LinkedIn الحقيقي
    github: null, // TODO: رابط GitHub الحقيقي
    others: [], // TODO: أي حسابات تانية (X، Stack Overflow...)
  },
  nav: [
    { label: "About", href: "/#about" },
    { label: "Skills", href: "/#skills" },
    { label: "Experience", href: "/#experience" },
    { label: "Projects", href: "/#projects" },
    { label: "Contact", href: "/#contact" },
  ],
  sections: {
    about: { title: "About" },
    skills: {
      title: "Technical skills",
      description: "Tools I use in production, grouped by where they sit in the stack.",
    },
    experience: { title: "Experience & education", description: "Most recent first." },
    projects: {
      title: "Featured projects",
      description:
        "Business systems built for real operational needs. Select a project for architecture details.",
    },
    contact: {
      title: "Contact",
      description:
        "Hiring for a frontend or full-time software engineering role? Send a message and I'll reply within one business day.",
    },
  },
  hero: {
    title: `${role} specializing in React, Next.js, and modern web applications.`,
    lead: `${engineeringYears} years of engineering experience delivering responsive user interfaces, integrating state management architectures, and building production-grade web systems.`,
    ctas: {
      primary: { label: "View projects", href: "/#projects" },
      secondary: { label: "Get in touch", href: "/#contact" },
    },
    quickFacts: [
      {
        icon: GraduationCap,
        text: `Software Engineering Graduate (${university.org}, ${formatPeriod(university.period)})`,
      },
      {
        icon: Briefcase,
        text: `${formatYears(productionYears)} production experience at ${davinda.org}`,
      },
      { icon: CircleCheck, text: availability },
    ],
    glance: [
      { label: "Role", value: role },
      { label: "Core stack", value: "React, Next.js, TypeScript" },
      { label: "State & data", value: "Zustand, Redux, TanStack Query" },
      {
        label: "Experience",
        value: `${engineeringYears} yrs total, ${formatYearCount(productionYears)} in production`,
      },
      { label: "Open to", value: "Full-time, on-site or remote" },
    ],
  },
  about: {
    paragraphs: [
      [
        "I'm a frontend engineer who cares about the parts of a product users touch every day: fast screens, predictable state, and interfaces that behave the same on a 5-inch phone and a 27-inch monitor.",
      ],
      [
        "At ",
        { emphasis: davinda.org },
        ", I shipped production features end to end, from translating Figma designs into reusable components to wiring them into REST and WebSocket APIs with caching, loading, and error states handled properly. My Software Engineering degree gives me a solid grounding in algorithms, databases, and software architecture, which shapes how I structure frontend codebases that teams can maintain.",
      ],
    ],
    principles: [
      {
        icon: Layers,
        title: "Maintainable architecture",
        description: "Typed components, clear state boundaries, and folder structures that scale.",
      },
      {
        icon: Gauge,
        title: "Performance by default",
        description: "Code splitting, request caching, and avoiding needless re-renders.",
      },
      {
        icon: Accessibility,
        title: "Accessible interfaces",
        description: "Semantic HTML, keyboard support, and accessible component primitives.",
      },
    ],
  },
  footer: { credit: `${university.title}, ${university.org}.` },
};
