import { cn } from "@/lib/utils";
import type { PixelIconName } from "@/pixel/sprites/icons";

type PixelIconProps = {
  name: PixelIconName;
  /** بدون = 18px، lg = 27px، xl = 54px (مضاعفات الـ 9 بكسل تبع الأيقونة) */
  size?: "lg" | "xl";
  className?: string;
};

/**
 * أيقونة pixel بلون النص (CSS mask على currentColor).
 * زينة دايماً (aria-hidden): المعنى بييجي من النص اللي جنبها أو من aria-label الأب.
 */
export function PixelIcon({ name, size, className }: PixelIconProps) {
  return <span aria-hidden="true" className={cn("ico", `i-${name}`, size, className)} />;
}
