import { cn } from "@/lib/utils";

type BtnOptions = {
  /** gold الزر الأساسي، ghost فوق النوافذ، dark للـ ground bar */
  variant?: "gold" | "ghost" | "dark";
  /** small جوّا الكروت، icon مربع 44px، start زر "Press start" الكبير */
  size?: "md" | "small" | "icon" | "start";
};

const VARIANT = { gold: "", ghost: "btn-ghost", dark: "btn-dark" } as const;
const SIZE = { md: "", small: "btn-small", icon: "btn-icon", start: "btn-start" } as const;

/** classes الزر، لـ <a> أو <button>: `className={btn({ variant: "ghost", size: "small" })}` */
export function btn({ variant = "gold", size = "md" }: BtnOptions = {}, className?: string) {
  return cn("btn", VARIANT[variant], SIZE[size], className);
}
