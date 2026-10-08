export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** بتنقرأ وقت كل استعمال (مش مرة وحدة): المستخدم ممكن يغيّر الإعداد والصفحة مفتوحة */
export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
