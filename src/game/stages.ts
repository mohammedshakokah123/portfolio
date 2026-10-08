export const STAGES = ["home", "about", "skills", "experience", "projects", "contact"] as const;

export type StageId = (typeof STAGES)[number];

/** الاسم القصير: بالـ HUD، بالـ ground bar، وبعنوان المرحلة */
export const STAGE_NAMES: Record<StageId, string> = {
  home: "Title",
  about: "About",
  skills: "Skills",
  experience: "Experience",
  projects: "Projects",
  contact: "Contact",
};

/** جوهرة وحدة بكل مرحلة ما عدا شاشة البداية */
export const GEM_IDS = ["about", "skills", "experience", "projects", "contact"] as const;

export type GemId = (typeof GEM_IDS)[number];

export function isStageId(value: string): value is StageId {
  return (STAGES as readonly string[]).includes(value);
}

/** "#about" أو "about" ← "about". أي شي تاني (فاضي، غلط، encoding خربان) ← "home" */
export function stageFromHash(hash: string): StageId {
  let id = hash.replace(/^#/, "");
  try {
    id = decodeURIComponent(id);
  } catch {
    /* hash مش صالح ← home */
  }
  return isStageId(id) ? id : "home";
}
