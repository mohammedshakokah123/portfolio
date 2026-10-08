import { KEYS, readRaw, writeRaw } from "./persist";
import { createStore } from "./store";

export type TimeOfDay = "day" | "night";

/** نفس منطق الـ boot script: المحفوظ، وإلا من إعداد النظام */
function initialTime(): TimeOfDay {
  if (typeof window === "undefined") return "day";
  const saved = readRaw(KEYS.time);
  if (saved === "day" || saved === "night") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
}

export const timeStore = createStore<TimeOfDay>(initialTime());

/** لون شريط المتصفح عالموبايل (من المرجع، السطر 2146) */
const THEME_COLOR: Record<TimeOfDay, string> = { day: "#14142B", night: "#0E1236" };

export function applyTime(time: TimeOfDay) {
  document.documentElement.dataset.time = time;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[time]);
}

export function toggleTime() {
  const next: TimeOfDay = timeStore.get() === "night" ? "day" : "night";
  timeStore.set(next);
  writeRaw(KEYS.time, next);
  applyTime(next);
}
