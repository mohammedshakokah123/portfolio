const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** بيقبل "YYYY" أو "YYYY-MM" بس، وأي شي تاني بيوقّف الـ build برسالة واضحة */
function parseYearMonth(value: string) {
  const match = /^(\d{4})(?:-(0[1-9]|1[0-2]))?$/.exec(value);
  if (!match) throw new Error(`Invalid date "${value}": expected "YYYY" or "YYYY-MM"`);
  return { year: Number(match[1]), month: match[2] ? Number(match[2]) : null };
}

/** "2025-02" ← "Feb 2025"، و"2020" ← "2020" */
export function formatYearMonth(value: string) {
  const { year, month } = parseYearMonth(value);
  return month ? `${MONTHS[month - 1]} ${year}` : String(year);
}

/** "Feb 2025 – Sep 2026"، وإذا ما في end: "Feb 2025 – Present" */
export function formatPeriod({ start, end }: { start: string; end: string | null }) {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}

/**
 * عدد السنين بين تاريخين، مع حساب شهر النهاية (متل ما بينقرا "Feb 2025 – Sep 2026")،
 * ومقرّب **لتحت** لأقرب نص سنة (20 شهر ← 1.5، و17 ← 1).
 * "YYYY" بالبداية = من أول السنة، وبالنهاية = لآخر السنة.
 */
export function yearsBetween(start: string, end: string) {
  const s = parseYearMonth(start);
  const e = parseYearMonth(end);
  const months = (e.year - s.year) * 12 + ((e.month ?? 12) - (s.month ?? 1)) + 1;
  if (months < 1) throw new Error(`Invalid period: "${end}" is before "${start}"`);
  return Math.floor(months / 6) / 2;
}

/** 0 (أقل من 6 شهور) ← "<1"، و1.5 ← "1.5" */
export function formatYearCount(years: number) {
  return years === 0 ? "<1" : String(years);
}

/** "<1 year"، "1 year"، "1.5 years" */
export function formatYears(years: number) {
  return `${formatYearCount(years)} ${years <= 1 ? "year" : "years"}`;
}
