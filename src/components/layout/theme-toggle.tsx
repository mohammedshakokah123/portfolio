"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * الأيقونتين بالـ HTML فوق بعض، والـ CSS (`dark:`) بيختار وحدة: ما في hydration mismatch ولا حاجة لـ mounted.
 * وقت التبديل: وحدة بتلف وبتختفي والتانية بتلف وبتبين (0.2s)، ومع reduced motion fade بس.
 * الـ `!` عالـ transition ضروري: `disableTransitionOnChange` تبع next-themes بيحط
 * `*{transition:none!important}` وقت التبديل، والـ class بيغلبه بالـ specificity.
 */
const iconClass =
  "col-start-1 row-start-1 size-4 transition-[rotate,opacity]! duration-200! ease-out! motion-reduce:rotate-0";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="grid place-items-center">
        <Sun
          className={cn(iconClass, "rotate-90 opacity-0 dark:rotate-0 dark:opacity-100")}
          aria-hidden="true"
        />
        <Moon
          className={cn(iconClass, "rotate-0 opacity-100 dark:-rotate-90 dark:opacity-0")}
          aria-hidden="true"
        />
      </span>
    </Button>
  );
}
