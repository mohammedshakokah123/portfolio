"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { useMounted } from "@/hooks/use-mounted";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted ? (
        // initial={false}: ما في حركة لأول أيقونة، بس وقت التبديل
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={resolvedTheme}
            className="grid place-items-center"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {resolvedTheme === "dark" ? (
              <Sun className="size-4" aria-hidden="true" />
            ) : (
              <Moon className="size-4" aria-hidden="true" />
            )}
          </m.span>
        </AnimatePresence>
      ) : (
        // قبل الـ mount ما منعرف الثيم: الأيقونتين بالـ HTML والـ CSS بيختار وحدة، فما في hydration mismatch
        <>
          <Sun className="hidden size-4 dark:block" aria-hidden="true" />
          <Moon className="block size-4 dark:hidden" aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
