import { formatYears, yearsBetween } from "@/lib/dates";
import type { ExperienceItem, MapNode } from "@/types/content";

// `satisfies` بدل `: ExperienceItem` مشان TypeScript يعرف إنه `end` مش null هون
// (إذا صار null، حساب productionYears تحت بيطلع خطأ compile).
export const davinda = {
  title: "Frontend Developer",
  org: "Davinda",
  period: { start: "2025-02", end: "2026-09" },
  meta: { icon: "briefcase", text: "Full-time, production engineering" },
  highlights: [
    "Built and shipped production features across customer-facing web applications using React, Next.js, and TypeScript.",
    "Contributed to frontend architecture: component structure, client state with Zustand and Redux Toolkit, and server state with TanStack Query.",
    "Built responsive, accessible components with Tailwind CSS and Radix UI, implemented directly from Figma specifications.",
    "Integrated REST APIs and WebSocket streams with consistent caching, loading, retry, and error handling.",
    "Took part in code reviews and a Git-based branching workflow with the wider engineering team.",
  ],
  tech: ["React", "Next.js", "TypeScript", "Zustand", "TanStack Query", "Tailwind CSS"],
} satisfies ExperienceItem;

export const university: ExperienceItem = {
  title: "B.Sc. in Software Engineering",
  org: "Latakia University",
  period: { start: "2020", end: "2026" },
  meta: { icon: "cap", text: "Faculty of Information Engineering" },
  highlights: [
    "Core computer science: data structures, algorithms, and complexity analysis.",
    "Software architecture, design patterns, and the software development lifecycle.",
    "Database design, SQL, operating systems, and computer networks.",
  ],
};

export const experience: readonly ExperienceItem[] = [davinda, university];

/** سنين الخبرة بالـ production (Davinda) ← بتنعرض بالـ Hero */
export const productionYears = yearsBetween(davinda.period.start, davinda.period.end);

/**
 * خريطة المسار فوق الـ quests: 3 محطات من البيانات ومحطة "الجاية" (الشركة اللي عم تقرأ).
 * الـ sprites من src/pixel/sprites/art.ts.
 */
export const careerMap: readonly MapNode[] = [
  { sprite: "academy", year: university.period.start, label: `Started B.Sc. at ${university.org}` },
  {
    sprite: "office",
    year: formatYears(productionYears),
    label: `${davinda.title} at ${davinda.org}`,
  },
  {
    sprite: "diploma",
    year: university.period.end ?? "In progress",
    label: "Graduated in Software Engineering",
  },
  { sprite: "flag", year: "Next stage", label: "Your team", next: true },
];
