import type { SkillGroup } from "@/types/content";

export const skills: readonly SkillGroup[] = [
  {
    title: "Frontend frameworks",
    icon: "code",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "Semantic Web"],
    pop: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "Semantic Web"],
  },
  {
    title: "UI & styling",
    icon: "brush",
    items: ["Tailwind CSS", "CSS3", "Responsive Design", "Radix UI", "Component Libraries"],
    pop: ["Tailwind CSS", "CSS3", "Responsive", "Radix UI", "Components"],
  },
  {
    title: "State & data fetching",
    icon: "database",
    items: ["Zustand", "Redux Toolkit", "TanStack Query", "Axios", "RESTful APIs", "WebSockets"],
    pop: ["Zustand", "Redux Toolkit", "TanStack Query", "Axios", "REST", "WebSockets"],
  },
  {
    title: "Tools & ecosystem",
    icon: "wrench",
    items: ["Git", "GitHub", "Vite", "AI-augmented workflows", "Figma inspection"],
    pop: ["Git", "GitHub", "Vite", "AI workflows", "Figma"],
  },
];

/**
 * الـ 3 blocks العائمين بمرحلة Skills (بيبينوا من 1600px وطالع). كل كبسة بتطلّع الكلمة اللي بعدها.
 * من المرجع (الأسطر 1456–1458).
 */
export const worldBlocks: readonly (readonly string[])[] = [
  ["React.js", "Next.js", "TypeScript", "JavaScript"],
  ["Tailwind CSS", "Radix UI", "CSS3", "Responsive"],
  ["Zustand", "Redux Toolkit", "TanStack Query", "WebSockets"],
];
