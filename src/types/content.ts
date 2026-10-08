import type { StageId } from "@/game/stages";
import type { ArtName } from "@/pixel/sprites/art";
import type { PixelIconName } from "@/pixel/sprites/icons";

/** نص فيه كلمات مميزة: كل جزء يا string عادي يا { emphasis } (بينعرض <strong>) */
export type RichText = (string | { emphasis: string })[];

/** chip بشاشة البداية. tone: "green" = الأيقونة خضرا (متل "Available") */
export type Fact = { icon: PixelIconName; text: string; tone?: "green" };

export type Stat = { label: string; value: string };

export type Ability = { icon: PixelIconName; title: string; description: string };

export type SiteConfig = {
  name: string;
  shortName: string; // بالـ HUD تحت 720px
  alternateNames: string[]; // طرق تانية لكتابة الاسم (إنجليزي/عربي) ← SEO
  role: string;
  url: string; // بدون "/" بالآخر
  description: string;
  ogDescription: string;
  keywords: string[]; // ← SEO
  email: string | null; // null = لسا ما وصل ← المكوّن بيخفيه
  location: string;
  cvPath: string;
  profileImage: string | null; // null = راس الشخصية الـ pixel
  availability: string;
  socials: {
    linkedin: string | null; // null = لسا ما وصل ← المكوّن بيخفيه
    github: string | null;
    others?: { label: string; url: string }[]; // X، Stack Overflow، dev.to...
  };
  /** السطر تحت عنوان كل مرحلة. العنوان نفسه من STAGE_NAMES */
  stageSubs: Record<Exclude<StageId, "home">, string>;
  home: {
    lead: string;
    sub: string;
    facts: Fact[];
  };
  about: {
    stats: Stat[];
    paragraphs: RichText[];
    abilities: Ability[];
  };
  footer: { credit: string };
};

export type SkillGroup = {
  title: string;
  icon: PixelIconName;
  items: string[];
  /** الكلمات اللي بتطلع (+React.js) لما تنكبس أيقونة المجموعة. أقصر من items مشان ما تطلع برّا الشاشة */
  pop: string[];
};

export type ExperienceItem = {
  title: string;
  org: string;
  /** "YYYY" أو "YYYY-MM" (بتنحط بـ <time dateTime>). end: null = لهلق ← شارة "Current quest" */
  period: { start: string; end: string | null };
  meta: { icon: PixelIconName; text: string };
  highlights: string[];
  tech?: string[];
};

/** محطة بخريطة المسار. next = المحطة الجاية: إطارها دهبي والشخصية واقفة عندها */
export type MapNode = {
  sprite: Extract<ArtName, "academy" | "office" | "diploma" | "flag">;
  year: string;
  label: string;
  next?: boolean;
};

export type Shot = { src: string; alt: string; caption: string };

export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string; // النص المختصر بالكارتريدج
  icon: PixelIconName; // أيقونة الـ placeholder لما ما في cover
  cover: { src: string; alt: string } | null; // صورة الكارتريدج (5:2). null = placeholder
  image: { src: string; alt: string } | null; // الصورة الرئيسية (16:10): أول صورة بمعرض المودال
  placeholderLabel: string; // aria-label للـ placeholder لما ما في cover
  tech: string[]; // tags الكارتريدج
  overview: string;
  architecture: string;
  features: string[];
  stack: string[];
  links: { demo?: string; source?: string };
  nda: boolean;
  accessNote?: string; // بيبدّل نص الشارة لما ما في روابط (متل "Client project, admin access only")
  gallery?: Shot[];
};
