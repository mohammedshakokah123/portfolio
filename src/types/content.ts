import type { LucideIcon } from "lucide-react";

export type NavItem = { label: string; href: `/#${string}` };

export type Cta = { label: string; href: `/#${string}` };

/** نص فيه كلمات مميزة: كل جزء يا string عادي يا { emphasis } (بينعرض بـ text-emphasis) */
export type RichText = (string | { emphasis: string })[];

/** عنوان القسم ووصفه (بيروحوا لـ SectionHeading) */
export type SectionIntro = { title: string; description?: string };

export type QuickFact = { icon: LucideIcon; text: string };

export type GlanceItem = { label: string; value: string };

export type Principle = { icon: LucideIcon; title: string; description: string };

export type SiteConfig = {
  name: string;
  alternateNames: string[]; // طرق تانية لكتابة الاسم (إنجليزي/عربي) ← SEO
  role: string;
  url: string; // بدون "/" بالآخر
  description: string;
  ogDescription: string;
  keywords: string[]; // ← SEO
  email: string | null; // null = لسا ما وصل ← المكوّن بيخفيه
  location: string;
  cvPath: string;
  profileImage: string | null; // null = يعرض placeholder
  availability: string;
  socials: {
    linkedin: string | null; // null = لسا ما وصل ← المكوّن بيخفيه
    github: string | null;
    others?: { label: string; url: string }[]; // X، Stack Overflow، dev.to...
  };
  nav: NavItem[];
  sections: Record<"about" | "skills" | "experience" | "projects" | "contact", SectionIntro>;
  hero: {
    title: string;
    lead: string;
    ctas: { primary: Cta; secondary: Cta };
    quickFacts: QuickFact[];
    glance: GlanceItem[];
  };
  about: {
    paragraphs: RichText[];
    principles: Principle[];
  };
  footer: { credit: string };
};

export type SkillGroup = { title: string; icon: LucideIcon; items: string[] };

export type ExperienceItem = {
  title: string;
  org: string;
  /** "YYYY" أو "YYYY-MM" (بتنحط بـ <time dateTime>). end: null = لهلق */
  period: { start: string; end: string | null };
  meta: { icon: LucideIcon; text: string };
  highlights: string[];
  tech?: string[];
};

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string; // النص المختصر بالكرت
  icon: LucideIcon; // أيقونة الـ placeholder
  image: { src: string; alt: string } | null; // null = يعرض placeholder. الـ alt وصفي (شو بيبيّن)، مش "screenshot"
  placeholderLabel: string; // aria-label للـ placeholder لما ما في صورة
  tech: string[]; // badges الكرت
  overview: string;
  architecture: string;
  features: string[];
  stack: string[];
  links: { demo?: string; source?: string };
  nda: boolean;
};
