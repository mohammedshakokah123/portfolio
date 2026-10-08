/**
 * نصوص الواجهة الثابتة: عناوين النوافذ، الأزرار، الشارات، ورسائل اللعبة.
 * ثوابت بس وبدون أي import، فمسموح تنستورد من client components.
 */
export const labels = {
  title: {
    start: "Press start",
    cv: "Download CV",
    contact: "Contact",
    facts: "Quick facts",
    hint: "Tip: use the arrow keys to switch stages. Click the character to jump.",
  },
  about: {
    bio: "Bio",
    abilities: "Abilities",
    hd: "HD photo",
  },
  experience: {
    map: "Career map",
    current: "Current quest",
    done: "Quest complete",
    tech: "Technologies used",
  },
  contact: {
    links: "Links",
    email: "Email",
    linkedin: "LinkedIn",
    github: "GitHub",
    location: "Location",
    cv: "Download CV (PDF)",
    form: "Send a message",
    credits: "Thanks for playing",
    backToTitle: "Back to title",
    cvShort: "CV (PDF)",
  },
  pause: {
    title: "Paused",
    sub: "Select a stage",
    gems: "bonus gems found",
    resume: "Resume",
  },
  gems: {
    collect: "Collect bonus gem",
    title: "Bonus gems found",
    all: "All 5 gems found. Thanks for exploring!",
  },
} as const;
