import { Code, Database, Palette, Wrench } from "lucide-react";

import type { SkillGroup } from "@/types/content";

export const skills: readonly SkillGroup[] = [
  {
    title: "Frontend frameworks",
    icon: Code,
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5", "Semantic Web"],
  },
  {
    title: "UI & styling",
    icon: Palette,
    items: ["Tailwind CSS", "CSS3", "Responsive Design", "Radix UI", "Component Libraries"],
  },
  {
    title: "State & data fetching",
    icon: Database,
    items: ["Zustand", "Redux Toolkit", "TanStack Query", "Axios", "RESTful APIs", "WebSockets"],
  },
  {
    title: "Tools & ecosystem",
    icon: Wrench,
    items: ["Git", "GitHub", "Vite", "AI-augmented workflows", "Figma inspection"],
  },
];
